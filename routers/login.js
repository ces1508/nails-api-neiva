const router = require('express').Router()
const { check } = require('express-validator/check')
const { login, createSecureAdmin } = require('../controllers/login')
const { validateData } = require('../utils/lib')

router.post('/login', [
  check('email').isEmail(),
  check('password').isString()
], validateData, login)
// router.post('/defualtAdmin', [
//   check('email').isEmail(),
//   check('password').isString()
// ], validateData, createSecureAdmin)
module.exports = router
