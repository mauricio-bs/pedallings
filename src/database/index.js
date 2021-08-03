import Sequelize from 'sequelize'
import dbConfiguration from '../config/database'

// Models
import User from '../app/model/User'
import Ride from '../app/model/Ride'
import Subscription from '../app/model/Subscription'

const models = [User, Ride, Subscription]

class Database {
  constructor() {
    this.init()
  }

  init() {
    this.connection = new Sequelize(dbConfiguration)
    models.map((model) => model.init(this.connection))
  }
}

export default new Database()
