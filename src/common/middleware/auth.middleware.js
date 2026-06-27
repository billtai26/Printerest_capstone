import { verifyAccessToken } from '../helpers/jwt.helper.js'

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken

    if (!token) {
      return res
        .status(401)
        .json({ message: 'Bạn chưa đăng nhập hoặc phiên làm việc hết hạn!' })
    }

    const decoded = verifyAccessToken(token)

    req.user = {
      id: decoded.userId,
      email: decoded.email,
    }

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
