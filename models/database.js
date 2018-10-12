const r = require('rethinkdbdash')({
  host: 'localhost',
  port: 28015,
  db: 'toctocnails'
})

class Database {
  async saveEmployed (data) {
    try {
      let newEmployed = await r.table('employes').insert({
        ...data,
        location: r.point(data.geo_position.lat, data.geo_position.long),
        createdAt: r.now()
      })
      return this.getEmployed(newEmployed.generated_keys[0])
    } catch (e) {
      return { error: true, code: 'ERROR DATABASE', action: 'CREATING_EMPLOYED', message: e.message }
    }
  }
  async getEmployed (id) {
    try {
      let employed = await r.table('employes').get(id).without('salt')
      return employed
    } catch (e) {
      return { error: true, code: 'ERROR DATABASE', action: 'GETING_EMPLOYED', message: e.message }
    }
  }
  async updateEmployed (id, data) {
    try {
      await r.table('employes').get(id).update(data)
      return this.getEmployed(id)
    } catch (e) {
      return { error: true, code: 'ERROR DATABASE', action: 'UPDATING_EMPLOYED', message: e.message }
    }
  }
  async destroyEmployed (id) {
    try {
      let employed = await r.table('employes').get(id).delete()
      if (employed.deleted === 1) return { status: 'deleted' }
      if (employed.skipped === 1) return { error: true, code: 404 }
    } catch (e) {
      return { error: true, code: 'ERROR DATABASE', action: 'DELETED_EMPLOYED', message: e.message }
    }
  }
  async employedAlreadyExits (data) {
    try {
      let exitisEmail = await this.usernameAlreadyExitis(data.username)
      let cedula = await r.table('employes').getAll(data.cedula, { index: 'cedula' }).count()
      return exitisEmail > 0 || cedula > 0
    } catch (e) {
      console.log(e)
      return true
    }
  }
  async usernameAlreadyExitis (username) {
    try {
      let usernameExits = await r.table('employes').getAll(username, { index: 'username' }).count()
      return usernameExits
    } catch (e) {
      return { error: true }
    }
  }
  async getPasswordOfEmployed (id, pasword) {
    try {
      let employed = await r.table('employes').get(id).pluck('password', 'sat')
      if (!employed) return { error: true, code: 404 }
      return employed
    } catch (e) {
      return { error: true, code: 'ERROR DATABASE', action: 'GET_PASSWORD_OF_EMPLOYED', message: e.message }
    }
  }
  async listOfEmployes (skip = 0, limit = 20) {
    skip = parseInt(skip)
    limit = parseInt(limit)
    try {
      let employes = await r.table('employes').skip(skip).limit(limit)
      return employes
    } catch (e) {
      return { error: true, code: 'ERROR DATABASE', action: 'LISTING EMPLOYES', message: e.message }
    }
  }
}

module.exports = Database
