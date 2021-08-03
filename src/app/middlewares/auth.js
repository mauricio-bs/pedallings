import jwt from 'jsonwebtoken'
import authConfiig from '../../config/auth'
import { promisify } from 'util'

export default async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) res.status(401).json({ Error: 'Token not provided' })

  const [, token] = authHeader.split(' ')

  try {
    const decoded = await promisify(jwt.verify)(token, authConfiig.secret)

    req.userId = decoded.id

    return next()
  } catch (err) {
    return res.status(401).json({ Error: 'Token invalid' })
  }
}
