const router = require('express').Router()
const multer = require('multer')
const uuid = require('uuid-base62')
const extension = require('file-extension')
const { body, param } = require('express-validator/check')
const path = require('path')
const { create, list, update, destroy } = require('../controllers/services')
const Database = require('../models/database')
const { validateData } = require('../utils/lib')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, `${uuid.v4()}.${extension(file.originalname)}`)
  }
})
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpg|jpeg|png/
  let mimetype = fileTypes.test(file.mimetype)
  let extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
  if (mimetype && extname) {
    return cb(null, true)
  }
  cb(null, false)
}
const upload = multer({ storage, fileFilter })

router.get('/', list)
router.post('/', upload.single('picture'), [
  body('name').exists().exists(),
  body('price').exists().isNumeric(),
  body('name').custom(value => {
    return Database.getServiceByName(value).then(services => {
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
  body('name').custom(value => {
    return Database.getServiceByName(value).then(services => {
      if (services.length > 0) {
        return Promise.reject(new Error('service already exits'))
      }
    })
  })
], validateData, update)
router.delete('/:id', [
  param('id').isUUID(4)
], validateData, destroy)
module.exports = router
