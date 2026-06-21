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
    // stack la noi hien thi chi tiet cua loi, bao gom cac duong dan den loi, khong co trong moi truong production, chi hien thi trong moi truong development
    stack: stack
  }
}
