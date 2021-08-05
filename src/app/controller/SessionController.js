import jwt from 'jsonwebtoken'
import User from '../model/User'
import authConfig from '../../config/auth'
import userValidate from '../../validation/userValidation'

class SessionController {
  async store(req, res) {
    // Validate data recived according to validation shape
    if (!userValidate.isValid(req.body)) {
      return res.status(400).json({ error: 'Validation fails' })
    }

    // email and password inserted
    const { email, password } = req.body

    // Check if user email already registered
    const user = await User.findOne({ where: { email } })
    if (!user) res.status(400).json({ error: 'User not exists' })

    // Check if passwords match
    if (!(await user.checkPassword(password))) {
      return res.status(400).json({ error: 'Password does not match' })
    }

    // User data
    const { id, name, age } = user

    // Return user informations and the token
    return res.status(200).json({
      user: {
        id,
        name,
        age,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    })
  }
}

export default new SessionController()
