import { verifyAccessToken } from '../helpers/jwt.helper.js'

export const protect = async (req, res, next) => {
  try {
    // Đọc trực tiếp accessToken từ cookies của request
    const token = req.cookies.accessToken

    if (!token) {
      return res
        .status(401)
        .json({ message: 'Bạn chưa đăng nhập hoặc phiên làm việc hết hạn!' })
    }

    // Giải mã và kiểm tra tính hợp lệ của token
    const decoded = verifyAccessToken(token)

    // Đưa thông tin giải mã (userId, email) vào req.user để các controller phía sau sử dụng
    req.user = decoded
    next()
  } catch (error) {
    return res
      .status(401)
      .json({
        message: 'Mã xác thực không hợp lệ hoặc đã hết hạn!',
        error: error.message,
      })
  }
}
