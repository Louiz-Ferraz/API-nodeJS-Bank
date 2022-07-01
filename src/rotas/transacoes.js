const express = require('express')
const rotasTransacoes = express()
const transacoes = require('../controladores/transacoes')
const { validarToken } = require('../intermediarios/intermediarios')

//Usando a validação para todas as rotas
rotasTransacoes.use(validarToken)

//Listar transações do usuário logado
rotasTransacoes.get('/transacao', transacoes.listarTransacoes)
//Obter extrato de transações
rotasTransacoes.get('/transacao/extrato', transacoes.obterExtrato)
//Detalhar uma transação do usuário logado
rotasTransacoes.get('/transacao/:id', transacoes.detalharTransacao)
//Cadastrar transação para o usuário logado
rotasTransacoes.post('/transacao', transacoes.cadastrarTransacao)
//Atualizar transação do usuário logado
rotasTransacoes.put('/transacao/:id', transacoes.atualizarTransacao)
//Excluir transação do usuário logado
rotasTransacoes.delete('/transacao/:id', transacoes.excluirTransacao)

module.exports = rotasTransacoes
