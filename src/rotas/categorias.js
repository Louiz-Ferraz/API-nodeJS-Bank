const express = require('express')
const rotasCategorias = express()
const categorias = require('../controladores/categorias')
const { validarToken } = require('../intermediarios/intermediarios')

rotasCategorias.get('/categoria', validarToken, categorias.listar)

module.exports = rotasCategorias
