import Sequelize, { Model } from 'sequelize'

class Subscription extends Model {
  static init(sequelize) {
    super.init(
      {
        ride_id: Sequelize.UUID,
        participant_id: Sequelize.UUID,
        subscription_date: Sequelize.DATE,
      },
      {
        sequelize,
      }
    )
  }

  // Add one ride and user ids
  static associate(model) {
    this.hasOne(model.Ride, {
      foreignKey: 'ride_id',
      as: 'ride_id',
      type: Sequelize.UUID,
    })
    this.hasOne(model.User, {
      foreignKey: 'user_id',
      as: 'participant_id',
      type: Sequelize.UUID,
    })
  }
}

export default Subscription
