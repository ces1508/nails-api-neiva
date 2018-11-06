const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const EmployesRouter = require('./routers/employes')
const clientsRouter = require('./routers/clients')
const servicesRouter = require('./routers/services')
const rootRouter = require('./routers/login')
const cors = require('cors')

const corsOption = {
  origin: 'http://localhost:3000'
}
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cors(corsOption))
app.use('/employes', EmployesRouter)
app.use('/clients', clientsRouter)
app.use('/services', servicesRouter)
app.use('/', rootRouter)
app.listen(300, err => {
  if (err) return process.exitCode(1)
  console.log('server running in port 300')
})
