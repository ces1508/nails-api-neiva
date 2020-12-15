const db = require('../models/database')
const { removePicture } = require('../utils/lib')
const { calculeTotalPages } = require('../utils/lib')

const create = async (req, res) => {
  let data = req.body
  if (data.id) delete data.id
  data.picture = req.file.filename
  // let findService = await db.getServiceByName(data.name)
  // if (findService.length > 0) return res.status(400).json({ error: true, message: 'the service alredy exits' })
  let service = await db.createService(data)
  res.json(service)
}

const list = async (req, res) => {
  const { page = 1 } = req.params
  const totalServices = await db.getTotalServices()
  const { pages, skip, limit } = calculeTotalPages(totalServices, 150, page)
  let services = await db.listOfServices(skip, limit)
  if (services.error) return res.status(500).json({ error: true, message: 'we have porblems, please try later' })
  res.json({ services, pages })
}

const update = async (req, res) => {
  let { id } = req.params
  let data = req.body
  if (data !== {}) {
    if (req.file) {
      data.picture = req.file.filename
    }
    let service = await db.updateService(id, data)
    if (service.error) return res.status(500).json({ error: true, message: 'we have porblems, please try later' })
    if (service.replaced >= 1) return res.status(200).json({ status: 'ok', message: 'service updated sucessfully' })
    if (service.skipped >= 1) return res.status(404).json({ error: true, message: 'service not found' })
  }
  console.log
  res.status(400).json({ error: true, message: 'we cant update the service' })
}

const destroy = async (req, res) => {
  let { id } = req.params
  let action = await db.destroyService(id)
  if (action.error) {
    console.log(action.error) // replace with winston log
    return res.status(500).json({ error: true, message: 'we have problems, please try later' })
  }
  if (action.service.skipped > 0) return res.status(404).json({ error: true, message: 'we cant find the service' })
  if (action.service.deleted > 0) {
    try {
      await removePicture(action.currentService.picture)
    } catch (e) {
      console.log(e.message) // replace with winston log
    }
    return res.status(200).json({ status: 'ok', message: 'service deleted' })
  }
  res.json({ error: true, message: 'we have problems, please tray later' })
}

module.exports = {
  list,
  create,
  update,
  destroy
}
