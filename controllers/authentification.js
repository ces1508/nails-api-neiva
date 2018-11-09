const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const Db = require('../models/database')
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
