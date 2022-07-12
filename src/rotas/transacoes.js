const express = require('express')
const rotasTransacoes = express()
const transacoes = require('../controladores/transacoes')
const { validarToken } = require('../intermediarios/intermediarios')

rotasTransacoes.use(validarToken)

rotasTransacoes.get('/transacao', transacoes.listarTransacoes)
rotasTransacoes.get('/transacao/extrato', transacoes.obterExtrato)
rotasTransacoes.get('/transacao/:id', transacoes.detalharTransacao)
rotasTransacoes.post('/transacao', transacoes.cadastrarTransacao)
rotasTransacoes.put('/transacao/:id', transacoes.atualizarTransacao)
rotasTransacoes.delete('/transacao/:id', transacoes.excluirTransacao)

module.exports = rotasTransacoes
