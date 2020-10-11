const Db = require('../models/database')
const Datasource = new Db()

const get = async (req, res) => {
  // const { skip, limit } = req.query
  const orders = await Datasource.getOrdersByState()
  if (orders.error) return res.status(500).json(orders)
  res.status(200).json(orders)
}

const update = async (req, res) => {
  const { id } = req.params
  const { state } = req.body
  const upatedOrder = await Datasource.updateOrderState(id, state)
  if (upatedOrder.error) return res.status(500).json({ error: { code: 'INTERNAL SERVER ERROR' } })
  if (upatedOrder.replaced === 1) return res.json({ status: 'ok', message: 'order updated' })
  res.status(422).json({
    error: {
      code: 'INTERNAL SERVER ERROR'
    }
  })
}


module.exports = {
  get,
  update
}
