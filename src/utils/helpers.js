const conexao = require('../conexao')

const validarBodyCadastro = (req, res) => {
  const { nome, email, senha } = req.body

  if (!nome) {
    res.status(400).json({ mensagem: `O campo nome é obrigatório.` })
    return false
  }

  if (!email) {
    res.status(400).json({ mensagem: 'O campo e-mail é obrigatório.' })
    return false
  }

  if (!senha) {
    res.status(400).json({ mensagem: 'O campo senha é obrigatório.' })
    return false
  }

  return true
}

const validarBodyLogin = (req, res) => {
  const { email, senha } = req.body

  if (!email) {
    res.status(400).json({ mensagem: 'O campo e-mail é obrigatório.' })
    return false
  }

  if (!senha) {
    res.status(400).json({ mensagem: 'O campo senha é obrigatório.' })
    return false
  }

  return true
}

const validarBodyTransacao = async (req, res) => {
  const { descricao, valor, data, categoria_id, tipo } = req.body

  if (!descricao) {
    res.status(400).json({ mensagem: `O campo descrição é obrigatório.` })
    return false
  }

  if (!valor) {
    res.status(400).json({ mensagem: `O campo valor é obrigatório.` })
    return false
  }

  if (!data) {
    res.status(400).json({ mensagem: `O campo data é obrigatório.` })
    return false
  }

  if (!categoria_id) {
    res
      .status(400)
      .json({ mensagem: `O campo id da categoria é obrigatório.` })
    return false
  }

  if (!tipo) {
    res.status(400).json({ mensagem: `O campo tipo é obrigatório.` })
    return false
  }

  if (tipo != 'entrada' && tipo != 'saida') {
    res
      .status(400)
      .json({ mensagem: `Insira um valor válido para o campo tipo.` })
    return false
  }

  try {
    const query = 'select * from categorias where id = $1'
    const categoriaExistente = await conexao.query(query, [categoria_id])

    if (categoriaExistente.rowCount === 0) {
      res.status(404).json({ mensagem: 'Insira um id de categoria válido.' })
      return false
    }
  } catch (error) {
    res.status(400).json({ mensagem: error.message })
    return false
  }

  return true
}

const validarEmailUnico = async email => {
  try {
    const queryEmailUnico = 'SELECT * FROM usuarios WHERE email = $1 LIMIT 1'
    const emailUnico = await conexao.query(queryEmailUnico, [email])
    if (emailUnico.rowCount !== 0) {
      return 'Já consta usuário com e-mail cadastrado.'
    }
  } catch (error) {
    return error.message
  }
  return 'OK'
}

const validarEmailCadastrado = async email => {
  try {
    const queryEmailUnico = 'SELECT * FROM usuarios WHERE email = $1 LIMIT 1'
    const emailUnico = await conexao.query(queryEmailUnico, [email])
    if (emailUnico.rowCount === 0) {
      return 'O e-mail ou senha estão incorretos.'
    }
  } catch (error) {
    return error.message
  }
  return 'OK'
}

module.exports = {
  validarBodyCadastro,
  validarBodyLogin,
  validarBodyTransacao,
  validarEmailUnico,
  validarEmailCadastrado
}
