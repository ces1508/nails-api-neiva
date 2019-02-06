const crypto = require('crypto')
const path = require('path')
const fs = require('fs')
const { validationResult } = require('express-validator/check')
const jwt = require('jsonwebtoken')
const SECRET = process.env.SECRET_TOKEN || '123123'
const multer = require('multer')
const uuid = require('uuid-base62')
const extension = require('file-extension')

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
    return res.status(422).json({ error: errors.array() })
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

const createToken = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, SECRET, { expiresIn: '1d' }, (err, token) => {
      if (err) return reject(new Error(err))
      resolve(token)
    })
  })
}

const handleFileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, `${uuid.v4()}.${extension(file.originalname)}`)
  }
})

const handleFileFilter = (req, file, cb) => {
  const fileTypes = /jpg|jpeg|png/
  let mimetype = fileTypes.test(file.mimetype)
  let extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
  if (mimetype && extname) {
    return cb(null, true)
  }
  cb(null, false)
}

module.exports = {
  encrytpPassword,
  validateData,
  removePicture,
  createToken,
  handleFileFilter,
  handleFileStorage
}
