const db = require('../models/database')
const { removePicture } = require('../utils/lib')

const create = async (req, res) => {
  let data = req.body
  let photos = req.files
  photos = photos.map((pic) => {
    return {
      name: pic.filename
    }
  })
  data.photos = photos
  let create = await db.createDecoration(data)
  if (create.error) return res.status(500).json({ error: true, message: 'we have problems, please tray later' })
  res.status(201).json({ status: 'created' })
}

const list = async (req, res) => {
  let decorations = []
  let { skip, title } = req.query
  if (title) {
    decorations = await db.getDecorationByTitle(title)
  } else {
    decorations = await db.getDecorationsList(skip, 20)
  }
  if (decorations.error) return res.status(500).json({ error: true, message: 'we have problems, please tray later' })
  res.status(200).json({ data: decorations })
}

const destroy = async (req, res) => {
  try {
    let { id } = req.params
    let decoration = await db.getDecoration(id)
    let action = await db.destroyDecoration(id)
    if (action.error) return res.status(500).json({ error: true, message: 'we have problems, please tray later' })
    let photos = decoration.photos.map(pic => {
      return removePicture(pic.name)
    })
    await Promise.all(photos)
    res.json({ status: 'deleted' })
  } catch (e) {
    res.status(500).json({ error: true, message: 'we have problems, please tray later', fullError: e })
  }
}

module.exports = {
  create,
  list,
  destroy
}
