const router = require('express').Router()
const multer = require('multer')
const uuid = require('uuid-base62')
const extension = require('file-extension')
const { body, check, validationResult } = require('express-validator/check')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, `${uuid.v4()}.${extension(file.originalname)}`)
  }
})
const upload = multer({ storage })

router.get('/', (req, res) => {
  res.send('list of services')
})
router.post('/', upload.single('picture'), [
  body('name').exists().exists(),
  body('price').exists().isNumeric()
], (req, res) => {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.send(errors.array())
  }
  res.send(req.body)
})
module.exports = router
