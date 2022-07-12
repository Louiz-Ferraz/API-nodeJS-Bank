const yup = require('./configuracoes')

const schemaCadastroTransacao = yup.object().shape({
  descricao: yup.string().required(),
  valor: yup.number().required(),
  data: yup.date().required(),
  categoria_id: yup.number().required(),
  tipo: yup.string().required()
})

module.exports = schemaCadastroTransacao