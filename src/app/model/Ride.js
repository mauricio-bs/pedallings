import Sequelize, { Model } from 'sequelize'

class Ride extends Model {
  static init(sequelize) {
    super.init(
      {
        author: Sequelize.UUID,
        name: Sequelize.STRING,
        start_date: Sequelize.DATE,
        registration_start_date: Sequelize.DATE,
        registration_end_date: Sequelize.DATE,
        additional_information: Sequelize.TEXT,
        start_place: Sequelize.STRING,
        participants_limit: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    )
  }

  // Rides belongs to
  static associate(models) {
    this.belongsTo(models.Subscription)
    this.hasOne(models.User, {
      foreignKey: 'user_id',
      as: 'author',
      type: Sequelize.UUID,
    })
  }
}

export default Ride
