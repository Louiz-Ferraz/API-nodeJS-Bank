const conexao = require('../conexao');
const securePassword = require('secure-password');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
const {
  validarEmailUnico,
  validarEmailCadastrado
} = require('../validacoes/helpers');
const schemaCadastroUsuario = require('../validacoes/schemaCadastroUsuario');
const schemaLogin = require('../validacoes/schemaLogin');

const pwd = securePassword();

const cadastrar = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    await schemaCadastroUsuario.validate(req.body);

    const emailUnicoValidado = await validarEmailUnico(email);
    if (emailUnicoValidado !== 'OK') {
      return res
        .status(400)
        .json({ mensagem: emailUnicoValidado });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ mensagem: error.message });
  }

  try {
    const hash = (await pwd.hash(Buffer.from(senha))).toString('hex');

    const queryCadastrarUsuario =
      'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3)';
    const novoUsuario = await conexao.query(queryCadastrarUsuario, [
      nome,
      email,
      hash
    ]);

    if (novoUsuario.rowCount === 0) {
      return res
        .status(400)
        .json({ mensagem: 'Não possível cadastrar o usuário.' });
    }

    const idCadastrado = await conexao.query(
      'SELECT id FROM usuarios WHERE email = $1',
      [email]
    );

    const usuarioCadastrado = {
      id: idCadastrado.rows[0].id,
      nome,
      email
    };

    return res.status(201).json(usuarioCadastrado);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
}

const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    await schemaLogin.validate(req.body);

    const emailCadastrado = await validarEmailCadastrado(email);
    if (emailCadastrado !== 'OK') {
      return res
        .status(400)
        .json({ mensagem: emailCadastrado });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ mensagem: error.message });
  }

  try {
    const queryUsuario = 'SELECT * FROM usuarios WHERE email = $1';
    const usuarioEncontrado = await conexao.query(queryUsuario, [email]);

    if (usuarioEncontrado.rowCount === 0) {
      return res.status(404).json('Usuário não encontrato!');
    }

    let usuario = usuarioEncontrado.rows[0];

    const result = await pwd.verify(Buffer.from(senha), Buffer.from(usuario.senha, "hex"));

    switch (result) {
      case securePassword.INVALID_UNRECOGNIZED_HASH:
      case securePassword.INVALID:
        return res.status(400).json({ mensagem: "O e-mail ou senha estão incorretos." });
      case securePassword.VALID:
        break;
      case securePassword.VALID_NEEDS_REHASH:
        try {
          const hash = (await pwd.hash(Buffer.from(senha))).toString("hex");
          const query = 'UPDATE usuarios SET senha = $1 WHERE email = $2';
          await conexao.query(query, [hash, email]);
        } catch {
        }
        break;
    }

    const token = jwt.sign({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email
    }, jwtSecret, {
      expiresIn: "1h"
    });

    usuario = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email
    }

    return res.status(200).json({ usuario, token });

  } catch (error) {
    return res
      .status(400)
      .json({ mensagem: error.message });
  }
}

const detalhar = async (req, res) => {
  const { authorization } = req.headers;

  const token = authorization.replace('Bearer ', '').trim();

  try {
    let usuario = jwt.verify(token, jwtSecret);
    usuario = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email
    }
    return res.status(200).json(usuario);
  } catch (error) {
    return res
      .status(400)
      .json({ mensagem: error.message });
  }
}

const atualizar = async (req, res) => {
  const { nome, email, senha } = req.body;

  const { authorization } = req.headers;
  const token = authorization.replace('Bearer ', '').trim();

  try {
    await schemaCadastroUsuario.validate(req.body);

    const usuario = jwt.verify(token, jwtSecret);
    const id = usuario.id;

    const queryEmailAtual = 'SELECT * FROM usuarios WHERE id = $1';
    const emailLogado = await conexao.query(queryEmailAtual, [id]);

    if (email !== emailLogado.rows[0].email) {
      const emailUnicoValidado = await validarEmailUnico(email);
      if (emailUnicoValidado !== 'OK') {
        return res
          .status(400)
          .json({ mensagem: emailUnicoValidado });
      }
    }


    const hash = (await pwd.hash(Buffer.from(senha))).toString('hex');

    const queryAtualizarUsuario =
      'UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4';
    const usuarioAtualizado = await conexao.query(queryAtualizarUsuario, [
      nome,
      email,
      hash,
      id
    ]);

    if (usuarioAtualizado.rowCount === 0) {
      return res
        .status(400)
        .json({ mensagem: 'Não possível atualizar o usuário.' });
    }

    return res.status(201).json();
  } catch (error) {
    return res
      .status(400)
      .json({ mensagem: error.message });
  }

}

module.exports = {
  cadastrar,
  login,
  detalhar,
  atualizar
}
