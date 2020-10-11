const router = require('express').Router()
const { check } = require('express-validator/check')
const orderController = require('../controllers/orders')
const { validateData } = require('../utils/lib')
const VALIDSTATES = ['pending', 'accepted', 'canceled', 'finished']

router.get('/', orderController.get)
router.put('/:id', [
  check('state').custom(value => {
    console.log('value is ', VALIDSTATES.indexOf(value))
    if (VALIDSTATES.indexOf(value) === -1) throw new Error('invalid order status')
    // console.log(VALIDSTATES.indexOf(value) === -1)
    return true
  })
], validateData, orderController.update)

module.exports = router
