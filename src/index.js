const express = require('express')
const rotasCategorias = require('./rotas/categorias')
const rotasTransacoes = require('./rotas/transacoes')
const rotasUsuarios = require('./rotas/usuarios')

const app = express()

app.use(express.json())
app.use(rotasUsuarios)
app.use(rotasCategorias)
app.use(rotasTransacoes)

app.listen(3000)
