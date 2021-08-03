import Sequelize, { Model } from 'sequelize'
import bcrypt from 'bcryptjs'

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        age: Sequelize.INTEGER,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        ride_participations: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    )
    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 10)
      }
    })
    return this
  }

  // User belongs to ride author column and to subcription table like participant
  static associate(models) {
    this.belongsTo(models.Ride, { type: Sequelize.UUID, as: 'author' })
    this.belongsTo(models.Subscription, {
      type: Sequelize.UUID,
      as: 'participant_id',
    })
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash)
  }
}

export default User
