import { v4 } from 'uuid'
import User from '../model/User'
import userValidation from '../../validation/userValidation'

class UserController {
  async index(req, res) {
    // Search and return all users of database and return a error
    // if occur an error to connect with database table, or don't find users
    try {
      const users = await User.findAll()
      if (users) {
        const { id, name, age, email, ride_participations } = users
        return res
          .status(200)
          .json({ id, name, age, email, ride_participations })
      }
    } catch (err) {
      return res.status(500).json({ error: 'No users found' })
    }
  }

  async show(req, res) {
    const { id } = req.params

    // Check if user exists looking for his ID on database,
    // and case don't find user ID, or an error occur to connect to database, return a error message
    try {
      const user = await User.findByPk(id)
      if (user) {
        const { name, age, email, ride_participations } = user
        return res
          .status(200)
          .json({ id, name, age, email, ride_participations })
      }
    } catch (err) {
      return res.status(400).json({ error: 'User not found' })
    }
  }

  async store(req, res) {
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
      return res
        .status(500)
        .json({ error: 'Internal server error', error_details: err })
    }
    // Success
    return res.status(201).json({ success: 'User created successfuly!' })
  }

  async delete(req, res) {
    const { id } = req.params

    // Check if user exists looking for ID on database, and delete it if found.
    // If occur errors like user not found, or database connection error, return an error
    try {
      if (!(await User.findByPk(id))) {
        return res.status(400).json({ error: 'User not found' })
      }
      await User.destroy({ where: { id } })
    } catch (err) {
      return res.json({ error: err })
    }
    // Success
    return res.status(204).json()
  }
}

export default new UserController()
