const conexao = require('../conexao')

const listar = async (req, res) => {
  try {
    const query = `
    select * from categorias
    order by id
    `
    const { rows: categorias } = await conexao.query(query)

    return res.status(200).json(categorias)
  } catch (error) {
    return res.status(400).json({ mensagem: error.message })
  }
}

module.exports = {
  listar
}
