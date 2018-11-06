const { createToken, encrytpPassword } = require('../utils/lib')
const Db = require('../models/database')
const database = new Db()

const login = async (req, res) => {
  let data = req.body
  let { email, password } = data
  let admin = await database.findAdminByEmail(email)
  if (!admin) return res.status(400).json({ error: true, code: 'BAD CREDENTIALS', message: 'incorret username or password' })
  let encodePassword = await encrytpPassword(password, admin.salt)
  if (admin.password === encodePassword.encode) {
    let token = await createToken({
      email: admin.email,
      id: admin.id
    })
    return res.status(201).send(token)
  }
  res.status(400).send('bad credentials')
}

const createSecureAdmin = async (req, res) => {
  let data = req.body
  let { email, password } = data
  let { encode, salt } = await encrytpPassword(password)
  let admin = {
    email,
    password: encode,
    salt,
    createdAt: new Date()
  }
  let newAdmin = await database.createAdmin(admin)
  if (newAdmin.error) {
    if (newAdmin.code === 'ADMIN ALREADY EXITS') return res.status(400).json({ error: true, message: 'admin already exits, please go to login' })
    return res.status(500).json({ error: true, message: 'we have problems, please try later' })
  }
  if (newAdmin.generate_keys.length > 0) return res.status(201).json({ status: 'ok' })
  res.status(500).json(newAdmin)
}

module.exports = {
  login,
  createSecureAdmin
}
