const router = require('express').Router()
const multer = require('multer')
const { body } = require('express-validator/check')
const { create, list, update } = require('../controllers/categories')
const { handleFileFilter, handleFileStorage, validateData } = require('../utils/lib')
const upload = multer({ storage: handleFileStorage, fileFilter: handleFileFilter })

router.get('/', list)
router.post('/', upload.single('picture'),[
  body('name').isString()
], validateData, create)
router.put('/:category_id', upload.single('picture'),[
  body('name').isString()
], validateData, update)

module.exports = router
