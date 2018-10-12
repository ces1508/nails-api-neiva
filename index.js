const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const EmployesRouter = require('./routers/employes')

app.use(bodyParser.json())
app.use('/employes', EmployesRouter)

app.listen(300, err => {
  if (err) return process.exitCode(1)
  console.log('server running in port 300')
})
