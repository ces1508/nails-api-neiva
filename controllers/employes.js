const Database = require('../models/database')
const { encrytpPassword } = require('../utils/lib')
const generator = require('generate-password')

const db = new Database()

const createEmployed = async (req, res, next) => {
  let data = req.body
  let securePassword = null
  data.cedula = parseInt(data.cedula)
  let verifyExitis = await db.employedAlreadyExits(data)
  if (verifyExitis) return res.status(400).json({ error: true, message: 'the employed already exits' })
  data.password = generator.generate({ length: 8, numbers: true, symbols: true })
  data.defualtPassword = true
  try {
    securePassword = await encrytpPassword(data.password)
  } catch (e) {
    return res.status(500).json({ error: true, message: 'we haave problems to securizate your password' })
  }
  data.password = securePassword.encode
  data.salt = securePassword.salt
  let employed = await db.saveEmployed(data)
  if (employed.error) return res.status(500).json({ error: true, message: 'we have problems, pleaasy try later' })
  res.status(201).json(employed)
}

const findUsername = async (req, res) => {
  let { username } = req.params
  let find = await db.usernameAlreadyExitis(username)
  if (find > 0) {
    return res.json({ status: 'exitis', message: 'the usernamae already exitis, please choose another' })
  }
  return res.json({ status: 'freedon', message: 'you can use this username' })
}

const destroy = async (req, res) => {
  let { id } = req.params
  let destroyEmployed = await db.destroyEmployed(id)
  if (destroyEmployed.error) {
    if (destroyEmployed.code) return res.status(404).json({ error: true, message: 'we cant find the employed' })
    return res.status(500).json({ error: true, message: 'we have problems to deleted the employed, please try later' })
  }
  res.json(destroyEmployed)
}

const list = async (req, res) => {
  let { skip = 0, limit = 20 } = req.query
  let employes = await db.listOfEmployes(skip, limit)
  if (employes.error) return res.status(500).json({ error: true, message: 'we have problems to get list of employes, please try later' })
  res.status(200).json(employes)
}
const changePassword = async (req, res) => {
  let { password } = req.body
  let { id } = req.params
  let securePassword = null
  try {
    securePassword = await encrytpPassword(password)
  } catch (e) {
    return res.status(500).json({ error: true, message: 'we have problems, please try later' })
  }
  let data = {
    password: securePassword.encode,
    salt: securePassword.salt
  }
  let uemployed = await db.updateEmployed(id, data)
  if (uemployed.error) return res.status(500).json({ error: true, message: 'we have problems, pleasy try later' })
  res.json(uemployed)
}

const confirmPassword = async (req, res, next) => {
  let { password } = req.body
  let { id } = req.params
  let employed = await db.getPasswordOfEmployed(id)
  if (employed.error) return res.status(400).json({ error: true, message: 'we have problems to find the employed' })
  let { encode } = await encrytpPassword(password, employed.salt)
  if (employed.password === encode) return next()
  res.status(400).json({ error: true, message: 'we canft find validate your password' })
}
module.exports = {
  createEmployed,
  findUsername,
  destroy,
  list,
  changePassword,
  confirmPassword
}
