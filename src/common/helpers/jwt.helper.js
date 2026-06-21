import jwt from 'jsonwebtoken'
import { JWT_REFRESH_SECRET, JWT_SECRET_KEY } from '../constant/app.constant.js'

export const signAccessToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '1h' })
}

export const verifyAccessToken = (token, options) => {
  return jwt.verify(token, JWT_SECRET_KEY, options)
}

export const signRefreshToken = (payload) => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' })
}

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, JWT_REFRESH_SECRET)
}
