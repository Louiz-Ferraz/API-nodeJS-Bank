const jwt = require('jsonwebtoken')
const jwtSecret = require('../jwt_secret')
const conexao = require('../conexao')

const validarToken = async (req, res, next) => {
  const { authorization } = req.headers

  if (!authorization) {
    return res.status(401).json({ mensagem: 'Faça login!' })
  }

  try {
    let token = authorization.replace('Bearer ', '').trim()

    let usuario = jwt.verify(token, jwtSecret)

    let { rows } = await conexao.query('select * from usuarios where id = $1', [
      usuario.id
    ])

    usuario = rows[0]

    if (usuario.rowCount === 0) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado.' })
    }

    let { senha: password, ...userWithoutPassword } = usuario

    req.usuario = userWithoutPassword

    return next()
  } catch (error) {
    return res.status(400).json({ mensagem: error.message })
  }
}

module.exports = {
  validarToken
}
