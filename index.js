const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const EmployesRouter = require('./routers/employes')
const clientsRouter = require('./routers/clients')
const servicesRouter = require('./routers/services')
const rootRouter = require('./routers/login')
const cors = require('cors')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const Db = require('./models/database')
const passport = require('passport')
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

app.use(cors(corsOption))
app.use('/employes', passport.authenticate('jwt', { session: false }), EmployesRouter)
app.use('/clients', passport.authenticate('jwt', { session: false }), clientsRouter)
app.use('/services', passport.authenticate('jwt', { session: false }), servicesRouter)
app.use('/', rootRouter)
app.listen(300, err => {
  if (err) return process.exitCode(1)
  console.log('server running in port 300')
})
