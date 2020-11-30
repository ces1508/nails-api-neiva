const router = require('express').Router()
const multer = require('multer')
const { body, param } = require('express-validator/check')
const { create, list, update, destroy } = require('../controllers/services')
const db = require('../models/database')
const { validateData, handleFileStorage, handleFileFilter } = require('../utils/lib')

const upload = multer({ storage: handleFileStorage, fileFilter: handleFileFilter })

router.get('/', validateData,  list)
router.post('/', upload.single('picture'), [
  body('name').exists().exists(),
  body('price').exists().isNumeric(),
  body('name').custom(value => {
    return db.getServiceByName(value).then(services => {
      if (services.length > 0) {
        return Promise.reject(new Error('service already exits'))
      }
    })
  })
], validateData, (req, res, next) => {
  if (!req.file) return res.status(422).json({ error: true, message: 'only support images png, jpg and jpeg' })
  next()
}, create)

router.patch('/:id', upload.single('picture'), [
  body('name').isString().optional().trim(),
  body('price').isNumeric().optional(),
  body('name').isString()
], validateData, update)
router.delete('/:id', [
  param('id').isUUID(4)
], validateData, destroy)


module.exports = router
