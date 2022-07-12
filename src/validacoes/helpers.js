const conexao = require('../conexao')

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

const validarTransacao = async (req, res) => {
  const { categoria_id, tipo } = req.body

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

module.exports = {
  validarEmailUnico,
  validarEmailCadastrado,
  validarTransacao
}
