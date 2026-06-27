import { statusCodes } from './status-code.help.js'

export const responseSuccess = (data, message = 'OK', statusCode = 200) => {
  return {
    status: 'success',
    statusCode: statusCode,
    message: message,
    data: data
  }
}

export const responseError = (
  message = 'Internal Server Error',
  statusCode = statusCodes.INTERNAL_SERVER_ERROR,
  stack
) => {
  return {
    status: 'error',
    statusCode: statusCode,
    message: message,
    stack: stack
  }
}
