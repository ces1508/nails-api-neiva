const router = require('express').Router()
const { create, list, exportToExcel } = require('../controllers/clients')
const { check } = require('express-validator/check')
router.get('/', list)
router.get('/export', exportToExcel)
router.get('/:id', [
  check('id').isUUID(4)
], create)
module.exports = router
