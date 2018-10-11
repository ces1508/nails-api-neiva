const router = require('express').Router()
const actions = require('../controllers/employees')
router.get('/', (req, res, next) => {
  res.send('hello world')
})

router.post('/', actions.createEmployed)
module.exports = router
