const Database = require('../models/database')
const should = require('chai').should()

describe('save()', function () {
  it('should be create a employed in database', async () => {
    const Db = new Database()
    let employed = {
      username: 'ces1508@gmail.com',
      password: '12345678',
      firstName: 'christian',
      lastName: 'segura',
      salt: '12311231231'
    }
    let newEmployed = await Db.saveEmployed(employed)
    newEmployed.should.have.property('id')
    newEmployed.username.should.be.equal(employed.username)
    newEmployed.password.should.be.equal(employed.password)
  })
})
