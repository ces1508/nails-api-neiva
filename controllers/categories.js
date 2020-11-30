const db = require('../models/database')
const { removePicture } = require('../utils/lib')

const list = async (req, res) => {
  const categories = await db.getAllCategories()
  if (categories.error) {
    return res.status(500).json({ code: categories.action })
  }

  res.json({ categories })
}

const create = async (req, res) => {
  let data = req.body
  if (data.id) delete data.id
  if (req.file) {
    data.image = req.file.filename
  }
  const category = await db.createCategory(data.name, data.image)
  if (category.inserted !== 1) {
    return res.status(400).json({ error: true, code: 'ERROR_CREATING_CATEGORY', message: 'lo sentimos tenemos problemas para crear la categoria' })
  }
  res.status(201).end()
}

const update = async (req, res) => {
  const { category_id } = req.params
  let { name, image } = req.body
  let status = 200
  let response = { status: 'ok', message: 'se ha modificado la categoria con exito' }
  if (req.file) {
    image = req.file.filename
  }
  const category = await db.updateCategory(category_id, name, image)
  if (category.error) {
    status = 500
    response = { error: true, code: category.action }
  }
  console.log(category)
  console.log(name, image)
  if (category.replaced !== 1) {
    status = 400
    response = { error: true, code: 'ERROR_UPDATING_CATEGORY', message: 'ocurrio un error editando la categoria' }
  }
  res.status(status).json(response)
}

module.exports = {
  list,
  create,
  update
}
