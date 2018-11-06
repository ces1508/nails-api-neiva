const { validationResult } = require('express-validator/check')
const Database = require('../models/database')

const db = new Database()
const create = async (req, res) => {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.send('lo  sentimos, pero debes enviar un id valido')
  }
  res.send('has pasado la validacion, que sistema de seguridad tan flojo xD')
}

const list = async (req, res) => {
  try {
    let { skip = 0, limit = 25 } = req.query
    let clients = await db.clientList(skip, limit)
    res.json({ data: clients })
  } catch (e) {
    res.status(500).json({ error: true })
  }
}
module.exports = {
  create,
  list
}
