import Sequelize, { Model } from 'sequelize'

class Subscription extends Model {
  static init(sequelize) {
    super.init(
      {
        subcription_date: Sequelize.DATE,
      },
      {
        sequelize,
      }
    )
  }

  // Add one ride and user ids
  static associate(model) {
    this.hasOne(model.Ride, {
      foreignKey: 'id',
      name: 'ride_id',
      type: Sequelize.UUID,
    })
    this.hasOne(model.User, {
      foreignKey: 'id',
      name: 'participant_id',
      type: Sequelize.UUID,
    })
  }
}

export default Subscription
