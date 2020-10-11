const r = require('rethinkdbdash')({
  host: 'localhost',
  port: 28015,
  db: 'toctocnails'
})

const r2 = require('rethinkdbdash')({
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
      let cedula = await r.table('employes').getAll(data.cedula, { index: 'cedula' }).count()
      return cedula > 0
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
  // async crateClient (data) {
  //   try {
  //     let client = await r.table('clients').create(data)
  //     client = await await r2.table('clienst').get(client.generated_keys[0])
  //     return client
  //   } catch (e) {
  //     return { error: true, code: 'ERROR DATABASE', action: 'CREATING_CLIENT', message: e.message }
  //   }
  // }
  async clientList (skip, limit, filter = {}) {
    try {
      let clients = await r2.table('clients').filter({}).skip(skip).limit(limit)
      return clients
    } catch (e) {
      return { error: true, code: 'ERROR DATABASE', action: 'LISTING_CLIENTS', message: e.message }
    }
  }
  async createService (data) {
    try {
      let service = await r.table('services').insert(data)
      return await r2.table('services').get(service.generated_keys[0])
    } catch (e) {
      return { error: true, code: 'ERROR DATABASE', action: 'CREATING_SERVICE', message: e.message }
    }
  }
  static async getServiceByName (name) {
    try {
      let service = await r2.table('services').getAll(name, { index: 'name' })
      return service
    } catch (e) {
      return { error: true, code: 'ERROR_DATABASE', action: 'GETING_SERVICE_BY_NAME', message: e.message }
    }
  }
  async listOfServices (skip, limit) {
    try {
      let services = await r2.table('services').orderBy('name').skip(skip).limit(limit)
      return services
    } catch (e) {
      return { error: true, code: 'ERROR DATABASE', action: 'CREATING_SERVICE', message: e.message }
    }
  }
  async updateService (id, data) {
    try {
      let service = await r.table('services').get(id).update(data)
      return service
    } catch (e) {
      return { error: true, code: 'ERROR DATABASE', action: 'UPDATE_SERVICE', message: e.message }
    }
  }
  async destroyService (id) {
    try {
      let currentService = await r2.table('services').get(id)
      let service = await r.table('services').get(id).delete()
      return { service, currentService }
    } catch (e) {
      return { error: true, code: 'ERROR DATABASE', action: 'DESTORY_SERVICE', message: e.message }
    }
  }
  // validate authentifaction
  async findAdminByEmail (email) {
    try {
      let admin = await r2.table('admins').getAll(email, { index: 'email' })
      return admin[0]
    } catch (e) {
      return { error: true, code: 'ERROR DATABASE', action: 'FINDING_ADMIN', message: e.message }
    }
  }

  async createAdmin (data) {
    try {
      let exitsAdmin = await this.findAdminByEmail(data.email)
      if (exitsAdmin) return { error: true, code: 'ADMIN ALREADY EXITS', action: 'CREATING_ADMIN', message: 'el correo ya se encuentra en uso, por favor intenta iniciar sesion' }
      let newAdmin = await r.table('admins').insert(data)
      return newAdmin
    } catch (e) {
      return { error: true, code: 'ERROR DATABASE', action: 'CREATING_ADMIN', message: e.message }
    }
  }
  async getAdmin (id) {
    try {
      let admin = await r.table('admins').get(id).without('password', 'salt')
      return admin
    } catch (e) {
      return { error: true, code: 'ERROR DATABASE', action: 'GETING_ADMIN', message: e.message }
    }
  }
  async getAllClients () {
    try {
      let clients = await r.table('clients')
      return clients
    } catch (e) {
      return { error: true, code: 'ERROR DATABASE', action: 'GETING_CLIENTS', message: e.message }
    }
  }
  async createDecoration (data) {
    try {
      let create = await r.table('decorations').insert(data)
      return create
    } catch (e) {
      return { error: true, code: 'ERROR DATABASE', action: 'CREATING_DECORATION', message: e.message }
    }
  }
  async getDecorationByTitle (title) {
    try {
      let decorations = await r.table('decorations').filter(r.row('title').match(`(?i)^${title}`))
      return decorations
    } catch (e) {
      return { error: true, code: 'ERROR DATABASE', action: 'GETING_DECORATIONS_BY_TITLE', message: e.message }
    }
  }
  async getDecorationsList (skip = 1, limit = 25) {
    try {
      let decorations = await r.table('decorations').skip(parseInt(skip)).limit(parseInt(limit))
      return decorations
    } catch (e) {
      return { error: true, code: 'ERROR DATABASE', action: 'GETING_DECORATIONS', message: e.message }
    }
  }
  async getDecoration (id) {
    try {
      let decoration = await r.table('decorations').get(id)
      return decoration
    } catch (e) {
      return { error: true, code: 'ERROR DATABASE', action: 'GETING_SINGLE_DECORATION', message: e.message }
    }
  }
  async destroyDecoration (id) {
    try {
      await r.table('decorations').get(id).delete(id)
      return true
    } catch (e) {
      return { error: true, code: 'ERROR DATABASE', action: 'GETING_SINGLE_DECORATION', message: e.message }
    }
  }
  async getOrdersByState (state = 'pending', skip = 0, limit = 25) {
    try {
      const orders = await r2.table('reservations').getAll(state, { index: 'state' }).map(row => {
        return {
          id: row('id'),
          address: row('address'),
          createdAt: row('createdAt'),
          time: row('hour'),
          state: row('state'),
          services: row('services').map(item => {
            return {
              service: r2.table('services').get(item('id')),
              quantity: item('cant')
            }
          }),
          client: r2.table('clients').get(row('userId'))
        }
      }
      ).skip(skip).limit(limit)
      return orders
    } catch (e) {
      return { error: true, code: 'ERROR DATABASE', action: 'GETING_ALL_ORDERS', message: e.message }
    }
  }
  async updateOrderState (id, state) {
    try {
      const updatedOrder = await r.table('reservations').get(id).update({ state })
      return updatedOrder
    } catch (e) {
      return { error: { code: 'DATABASE_ERROR', action: 'GETING_LIST_DECORATIONS', message: e.message } }
    }
  }
}

module.exports = Database
