const crypto = require('crypto')
const path = require('path')
const fs = require('fs')
const { validationResult } = require('express-validator/check')

const encrytpPassword = async (txt, salt = null) => {
  if (!salt) {
    salt = await crypto.randomBytes(50)
    salt = salt.toString('hex')
  }
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(txt, salt.toString(), 100000, 128, 'sha512', (err, derivedKey) => {
      if (err) return reject(new Error(err))
      resolve({ salt, encode: derivedKey.toString('hex') })
    })
  })
}

const validateData = async (req, res, next) => {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    if (req.file) {
      await removePicture(req.file.filename)
    }
    return res.status(422).json({ errors: errors.array() })
  }
  next()
}

const removePicture = (src) => {
  return new Promise((resolve, reject) => {
    fs.unlink(path.resolve('./uploads', src), err => {
      if (err) return reject(new Error(err.message))
      return resolve(true)
    })
  })
}
module.exports = {
  encrytpPassword,
  validateData,
  removePicture
}
