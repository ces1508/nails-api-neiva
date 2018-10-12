const router = require('express').Router()
const { check, validationResult } = require('express-validator/check')
const actions = require('../controllers/employes')

const handleErros = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) return next()
  res.json(errors.array())
}

router.get('/', actions.list)
router.post('/', [
  check('username').isEmail(),
  check('firstName').isString(),
  check('lastName').isString(),
  check('comuna').isNumeric({ min: 1 }),
  check('cedula').isNumeric(),
  check('phone').isNumeric(),
  check('geo_position').custom((value, { req }) => {
    if (typeof req.body.geo_position !== 'object') {
      throw new Error('you need send a object with the properties lat: float, long: float')
    }
    if (!value.hasOwnProperty('lat') || !value.hasOwnProperty('long')) {
      throw new Error('you need send lat and long properties')
    }
    return true
  })
], handleErros, actions.createEmployed)

router.get('/search/:username', [
  check('username').isEmail()
], handleErros, actions.findUsername)

router.delete('/:id', [check('id').isUUID(4)], handleErros, actions.destroy)
module.exports = router
