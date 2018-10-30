const create = async (req, res) => {
  res.send('now will be create a service')
}

const list = async (req, res) => {
  res.send('this endpoint will be send array with list')
}

module.exports = {
  list,
  create
}
