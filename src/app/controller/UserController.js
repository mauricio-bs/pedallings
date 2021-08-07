import { v4 } from 'uuid'
// Model
import User from '../model/User'
import Ride from '../model/Ride'
import Subscription from '../model/Subscription'
// Validation shapes
import userValidation from '../../validation/userValidation'

class UserController {
  async store(req, res) {
    // Information passed
    const user = req.body

    // Validate recived data according to validation shape,
    // and return all errors found by YUP framework
    try {
      await userValidation.validateSync(user, { abortEarly: false })
    } catch (err) {
      return res.status(400).json({ error: err.errors })
    }

    // Check if email is already registered, if true send a error message
    // telling to the user that this email already registered
    if (await User.findOne({ where: { email: user.email } })) {
      return res.status(400).json({ error: 'Email already registered' })
    }

    // Check if users age is lower than 5
    if (user.age < 5) res.status(400).json({ error: 'User is too younger' })

    // Store user data in database, and case don't be able to connect with
    // database model or data creation fails, return an error
    try {
      User.create({
        id: v4(),
        name: user.name,
        email: user.email,
        age: user.age,
        password: user.password,
      })
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error' })
    }
    // Success
    return res.status(201).json({ success: 'User created successfuly!' })
  }

  async index(req, res) {
    // Search and return all users found in database, without password column
    // if return an error if don't be able to connect with database, or don't find users
    try {
      const users = await User.findAll()
      if (users) {
        const usrs = users.map((info) => {
          const allUsers = {
            id: info.id,
            name: info.name,
            age: info.age,
            email: info.email,
            ride_participations: info.ride_participations,
            createdAt: info.createdAt,
            updatedAt: info.updatedAt,
          }

          return allUsers
        })
        return res.status(200).json(usrs)
      }
    } catch (err) {
      return res.status(400).json({ error: 'No users found' })
    }
  }

  async show(req, res) {
    // User ID passed in URL
    const { id } = req.params

    // Check by ID if user exists, and return his informations,
    // If don't find users or don't be able to connect with database, return an error
    try {
      const user = await User.findByPk(id)
      if (user) {
        const { name, age, email, ride_participations, createdAt, updatedAt } =
          user
        return res.status(200).json({
          id,
          name,
          age,
          email,
          ride_participations,
          createdAt,
          updatedAt,
        })
      } else res.status(400).json({ error: 'User not found' })
    } catch (err) {
      return res.status(400).json({ error: 'User not found' })
    }
  }

  async delete(req, res) {
    // User ID passed in URL
    const { id } = req.params

    // Check by ID if user exists
    // // If don't find users or don't be able to connect with database, return an error
    if (!(await User.findByPk(id))) {
      return res.status(400).json({ error: 'User not found' })
    }

    // Update table fields where user was ride author or participant at subscription
    // And delete use
    try {
      await Subscription.update(
        { participant_id: 0 },
        { where: { participant_id: id } }
      )
      await Ride.update({ author: 0 }, { where: { author: id } })
      await User.destroy({ where: { id } })
    } catch (err) {
      return res.json({ error: err })
    }
    // Success
    return res.status(204).json()
  }
}

export default new UserController()
