const conexao = require('../conexao')
const { validarTransacao } = require('../validacoes/helpers')
const schemaCadastroTransacao = require('../validacoes/schemaCadastroTransacao')

const listarTransacoes = async (req, res) => {
  const { usuario } = req
  const { filtro } = req.query

  if (filtro === undefined) {
    try {
      const query = `
    SELECT t.id,
    t.tipo,
    t.descricao,
    t.valor,
    t.data,
    t.usuario_id,
    t.categoria_id, 
    c.descricao as categoria_nome  
    FROM transacoes t 
    LEFT JOIN categorias c on t.categoria_id = c.id
    WHERE t.usuario_id = $1
    `
      const { rows: transacoes } = await conexao.query(query, [usuario.id])

      return res.status(200).json(transacoes)
    } catch (error) {
      return res.status(400).json({ mensagem: error.message })
    }
  }

  try {
    let transacoesFiltradas = []

    for (let item of [filtro].flat()) {
      const query = `
        SELECT
          t.id,
          t.tipo,
          t.descricao,
          t.valor,
          t.data,
          t.usuario_id,
          t.categoria_id,
          c.descricao as categoria_nome 
        FROM transacoes t 
        LEFT JOIN categorias c on t.categoria_id = c.id
        WHERE t.usuario_id = $1 AND c.descricao ILIKE $2
      `
      const { rows: transacoes } = await conexao.query(query, [
        usuario.id,
        item
      ])

      if (transacoes[0] === undefined) {
        continue
      }

      for (let transacao of transacoes) {
        transacoesFiltradas.push(transacao)
      }
    }

    return res.status(200).json(transacoesFiltradas)
  } catch (error) {
    return res.status(400).json({ mensagem: error.message })
  }
}

const detalharTransacao = async (req, res) => {
  const { usuario } = req
  const { id } = req.params

  try {
    const query = `
    SELECT t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id, t.categoria_id, c.descricao as categoria_nome  FROM transacoes t 
    LEFT JOIN categorias c on t.categoria_id = c.id
    WHERE t.id = $1
    `
    const transacao = await conexao.query(query, [id])

    if (transacao.rowCount === 0) {
      return res.status(404).json({
        mensagem: 'Transação não encontrada, por favor digitar um id válido.'
      })
    }

    if (transacao.rows[0].usuario_id !== usuario.id) {
      return res.status(401).json({
        mensagem: 'O usuário não tem permissão para acessar essa transação.'
      })
    }

    return res.status(200).json(transacao.rows[0])
  } catch (error) {
    return res.status(400).json({ mensagem: error.message })
  }
}

const cadastrarTransacao = async (req, res) => {
  const { usuario } = req
  const { descricao, valor, data, categoria_id, tipo } = req.body

  if (!await validarTransacao(req, res)) {
    return
  }

  try {
    await schemaCadastroTransacao.validate(req.body);

    const query = `
  INSERT INTO transacoes
  (descricao, valor, data, categoria_id, usuario_id, tipo)
  VALUES
  ($1, $2, $3, $4, $5, $6) RETURNING *  
  `
    const novaTransacao = await conexao.query(query, [
      descricao,
      valor,
      data,
      categoria_id,
      usuario.id,
      tipo
    ])

    if (novaTransacao.rowCount === 0) {
      return res
        .status(400)
        .json({ mensagem: 'Não foi possivel cadastrar a transação.' })
    }

    return res.status(201).json(novaTransacao.rows[0])
  } catch (error) {
    return res.status(400).json({ mensagem: error.message })
  }
}

const atualizarTransacao = async (req, res) => {
  const { usuario } = req
  const { descricao, valor, data, categoria_id, tipo } = req.body
  const { id } = req.params

  if (!await validarTransacao(req, res)) {
    return
  }

  try {
    await schemaCadastroTransacao.validate(req.body);

    const query = `UPDATE transacoes SET 
    descricao = $1,
    valor = $2,
    data = $3,
    categoria_id = $4,
    tipo = $5
    WHERE id = $6
    RETURNING *`

    const transacaoAtualizada = await conexao.query(query, [
      descricao,
      valor,
      data,
      categoria_id,
      tipo,
      id
    ])

    if (transacaoAtualizada.rowCount === 0) {
      return res.status(404).json({
        mensagem: 'Transação não encontrada, não foi possível atualizar.'
      })
    }

    if (transacaoAtualizada.rows[0].usuario_id !== usuario.id) {
      return res
        .status(401)
        .json({ mensagem: 'O usuário não possui acesso a essa transação.' })
    }

    return res.status(201).json()
  } catch (error) {
    return res.status(400).json({ mensagem: error.message })
  }
}

const excluirTransacao = async (req, res) => {
  const { usuario } = req
  const { id } = req.params

  try {
    const idUsuario = usuario.id

    const queryTransacao = `
    SELECT *
    FROM transacoes
    WHERE id = $1 AND usuario_id = $2
    `
    const transacao = await conexao.query(queryTransacao, [id, idUsuario])

    if (transacao.rowCount === 0) {
      return res.status(404).json({ mensagem: 'Transação não encontrada.' })
    }

    const queryExclusao = `
    DELETE FROM transacoes
    WHERE id = $1 
    `
    const transacaoExcluida = await conexao.query(queryExclusao, [id])

    return res.status(204).json()
  } catch (error) {
    return res.status(400).json({ mensagem: error.message })
  }
}

const obterExtrato = async (req, res) => {
  const { usuario } = req

  try {
    const queryTransacoesUsuario = `
    SELECT tipo, valor
    FROM transacoes
    WHERE usuario_id = $1
    `
    const transacoes = await conexao.query(queryTransacoesUsuario, [usuario.id])

    let entrada = 0
    let saida = 0
    for (row of transacoes.rows) {
      if (row.tipo === 'entrada') {
        entrada += row.valor
      }
      if (row.tipo === 'saida') {
        saida += row.valor
      }
    }

    return res.status(200).json({ entrada, saida })
  } catch (error) {
    return res.status(400).json({ mensagem: error.message })
  }
}

module.exports = {
  listarTransacoes,
  detalharTransacao,
  cadastrarTransacao,
  atualizarTransacao,
  excluirTransacao,
  obterExtrato
}
