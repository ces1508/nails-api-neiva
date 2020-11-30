const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const json2xls = require('json2xls')
const cors = require('cors')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const EmployesRouter = require('./routers/employes')
const clientsRouter = require('./routers/clients')
const servicesRouter = require('./routers/services')
const decorationRouter = require('./routers/decorations')
const CategoriesRouter = require('./routers/categories')
const rootRouter = require('./routers/login')
const db = require('./models/database')

const app = express()
const APP_PORT = process.env.PORT || 300

let options = {}
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
options.secretOrKey = process.env.SECRET_TOKEN || '123123'

passport.use(new JwtStrategy(options, async (payload, done) => {
  let admin = await db.getAdmin(payload.id)
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
app.use('/decorations', passport.authenticate('jwt', { session: false }), decorationRouter)
app.use('/categories', passport.authenticate('jwt', { session: false }), CategoriesRouter)
app.use('/', rootRouter)

app.listen(APP_PORT, err => {
  if (err) return process.exitCode(1)
  console.log('server running in port 300')
})
