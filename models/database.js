const r = require('rethinkdbdash')()

class Database {
  async saveEmployed (data) {
    try {
      let newEmployed = await r.table('employes').insert(data)
      return this.getEmployed(newEmployed.generate_keys[0])
    } catch (e) {
      return { error: true, code: 'ERROR DATABASE', action: 'CREATING_EMPLOYED', message: e.message }
    }
  }
  async getEmployed (id) {
    try {
      let employed = await r.table('employes').get(id).whiout('salt', 'password')
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
      await r.table('employes').get(id).remove()
      return { status: 'deleted', message: 'the employed has ben destroyed' }
    } catch (e) {
      return { error: true, code: 'ERROR DATABASE', action: 'DELETED_EMPLOYED', message: e.message }
    }
  }
}

module.exports = Database
