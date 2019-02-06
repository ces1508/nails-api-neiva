const router = require('express').Router()
const multer = require('multer')
const { body } = require('express-validator/check')
const {
  validateData,
  handleFileStorage,
  handleFileFilter
} = require('../utils/lib')
const { create, list, destroy } = require('../controllers/decorations')

const upload = multer({ storage: handleFileStorage, fileFilter: handleFileFilter })

router.get('/', list)
router.post('/', upload.array('photos', 5), [
  body('title').isString().exists()
], validateData, create)
router.delete('/:id', destroy)
module.exports = router
