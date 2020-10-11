const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const json2xls = require('json2xls')
const cors = require('cors')
const fs = require('fs')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const uploadFolderExits = fs.existsSync('uploads')

if (!uploadFolderExits) {
  fs.mkdir('./uploads', err => {
    if (err) throw err
  })
}

const EmployesRouter = require('./routers/employes')
const clientsRouter = require('./routers/clients')
const servicesRouter = require('./routers/services')
const decorationRouter = require('./routers/decorations')
const rootRouter = require('./routers/login')
const ordersRouter = require('./routers/orders')
const Db = require('./models/database')

const app = express()
const DataSource = new Db()

let options = {}
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
options.secretOrKey = process.env.SECRET_TOKEN || '123123'

passport.use(new JwtStrategy(options, async (payload, done) => {
  let admin = await DataSource.getAdmin(payload.id)
  if (admin.error) return done(true, false)
  if (admin) {
    return done(null, admin)
  }
}))

const corsOption = {
  origin: 'http://localhost:3000'
}
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(json2xls.middleware)
app.use(cors(corsOption))

app.use('/employes', passport.authenticate('jwt', { session: false }), EmployesRouter)
app.use('/clients', passport.authenticate('jwt', { session: false }), clientsRouter)
app.use('/services', passport.authenticate('jwt', { session: false }), servicesRouter)
app.use('/orders', passport.authenticate('jwt', { session: false }), ordersRouter)
app.use('/decorations', decorationRouter)
app.use('/', rootRouter)

app.listen(300, err => {
  if (err) return process.exitCode(1)
  console.log('server running in port 300')
})
