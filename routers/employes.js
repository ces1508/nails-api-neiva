const router = require('express').Router()
const { check } = require('express-validator/check')
const actions = require('../controllers/employes')
const { validateData } = require('../utils/lib')
const Db = require('../models/database')
const Datasource = new Db()
router.get('/', actions.list)
router.post('/', [
  check('username').isEmail(),
  check('firstName').isString(),
  check('lastName').isString(),
  check('comuna').isNumeric({ min: 1 }),
  check('cedula').isNumeric(),
  check('phone').isNumeric(),
  check('username').custom(async (value, { req }) => {
    let exitsEmail = await Datasource.usernameAlreadyExitis(value)
    if (exitsEmail > 0) throw new Error('username already exits')
    return true
  }),
  check('geo_position').custom((value, { req }) => {
    if (typeof req.body.geo_position !== 'object') {
      throw new Error('you need send a object with the properties lat: float, long: float')
    }
    if (!value.hasOwnProperty('lat') || !value.hasOwnProperty('long')) {
      throw new Error('you need send lat and long properties')
    }
    return true
  })
], validateData, actions.createEmployed)

router.get('/search/:username', [
  check('username').isEmail()
], validateData, actions.findUsername)

router.delete('/:id', [check('id').isUUID(4)], validateData, actions.destroy)
router.patch('/:id', actions.update)
module.exports = router
