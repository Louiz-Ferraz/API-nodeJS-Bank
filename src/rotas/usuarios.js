const express = require('express')
const rotasUsuarios = express()
const usuarios = require('../controladores/usuarios')
const { validarToken } = require('../intermediarios/intermediarios')

//Cadastrar usuário
rotasUsuarios.post('/usuario', usuarios.cadastrar)
//Login do usuário
rotasUsuarios.post('/login', usuarios.login)
//Detalhar usuário
rotasUsuarios.get('/usuario', validarToken, usuarios.detalhar)
//Atualizar usuário
rotasUsuarios.put('/usuario', validarToken, usuarios.atualizar)

module.exports = rotasUsuarios
