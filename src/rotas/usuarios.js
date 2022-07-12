const express = require('express')
const rotasUsuarios = express()
const usuarios = require('../controladores/usuarios')
const { validarToken } = require('../intermediarios/intermediarios')

rotasUsuarios.post('/usuario', usuarios.cadastrar)
rotasUsuarios.post('/login', usuarios.login)
rotasUsuarios.get('/usuario', validarToken, usuarios.detalhar)
rotasUsuarios.put('/usuario', validarToken, usuarios.atualizar)

module.exports = rotasUsuarios
