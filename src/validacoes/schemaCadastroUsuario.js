const yup = require('./configuracoes')

const schemaCadastroUsuario = yup.object().shape({
    nome: yup.string().required(),
    email: yup.string().email().required(),
    senha: yup.string().required()
})

module.exports = schemaCadastroUsuario