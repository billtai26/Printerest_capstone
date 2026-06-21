import { responseError } from './response.helper.js'
import jwt from 'jsonwebtoken'
import { statusCodes } from './status-code.help.js'

export const appError = (err, req, res, next) => {
  console.log(err)

  if (err instanceof jwt.TokenExpiredError) {
    err.statusCode = statusCodes.UNAUTHORIZED
  }

  if (err instanceof jwt.TokenExpiredError) {
    err.statusCode = statusCodes.FORBIDDEN 
  }

  const response = responseError(err?.message, err?.statusCode, err?.stack)

  res.status(response.statusCode).json(response)
}
