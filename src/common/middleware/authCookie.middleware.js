import { verifyAccessToken } from '../helpers/jwt.helper.js'
import { prisma } from '../prisma/connect.prisma.js'

export const authCookie = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken

    if (!token) {
      const error = new Error(
        'Bạn không có quyền truy cập, vui lòng đăng nhập!',
      )
      error.statusCode = 401
      throw error
    }

    const decoded = verifyAccessToken(token)

    const user = await prisma.users.findUnique({
      where: { id: decoded.userId },
    })

    if (!user) {
      const error = new Error('Tài khoản người dùng này không tồn tại!')
      error.statusCode = 401
      throw error
    }

    const { password: _, ...userWithoutPassword } = user
    req.user = userWithoutPassword

    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        statusCode: 401,
        message: 'Mã truy cập Access Token đã hết hạn!',
        code: 'ACCESS_TOKEN_EXPIRED',
      })
    }

    return res.status(error.statusCode || 401).json({
      status: 'error',
      statusCode: error.statusCode || 401,
      message: error.message || 'Mã xác thực không hợp lệ!',
    })
  }
}
