const { validationResult } = require('express-validator/check')
const Database = require('../models/database')
const csv = require('csv-express')
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
    let data = await db.getAllClients()
    res.json(data)
  } catch (e) {
    res.status(500).json({ error: true })
  }
}
const exportToExcel = async (req, res) => {
  let data = await db.getAllClients()
  if (req.query.csv) {
    res.setHeader('Content-Disposition', 'attachment; filename=cients.csv')
    res.setHeader('Content-Type', 'text/csv')
    return res.csv(data)
  }
  res.xls('clients.xlsx', data)
}
module.exports = {
  create,
  list,
  exportToExcel
}
