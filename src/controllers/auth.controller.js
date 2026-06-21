import { responseSuccess } from '../common/helpers/response.helper.js'
import { authService } from '../services/auth.service.js'

const cookieOptions = {
  httpOnly: true,
  secure: false, // Để true nếu chạy môi trường https sản xuất
  sameSite: 'lax',
}

export const authController = {
  async register(req, res, next) {
    try {
      const result = await authService.register(req)
      const response = responseSuccess(result, `Đăng ký tài khoản thành công`)
      res.status(response.statusCode).json(response)
    } catch (err) {
      next(err)
    }
  },

  async login(req, res, next) {
    try {
      const result = await authService.login(req)

      // Tiến hành lưu token vào cookies giống dự án mẫu của bạn
      res.cookie('accessToken', result.accessToken, {
        ...cookieOptions,
        maxAge: 60 * 60 * 1000,
      }) // 1 tiếng
      res.cookie('refreshToken', result.refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      }) // 7 ngày

      const response = responseSuccess(
        { user: result.user },
        `Đăng nhập thành công`,
      )
      res.status(response.statusCode).json(response)
    } catch (err) {
      next(err)
    }
  },

  async refreshToken(req, res, next) {
    try {
      const result = await authService.refreshToken(req)
      res.cookie('accessToken', result.accessToken, {
        ...cookieOptions,
        maxAge: 60 * 60 * 1000,
      })

      const response = responseSuccess(null, `Làm mới token thành công`)
      res.status(response.statusCode).json(response)
    } catch (err) {
      next(err)
    }
  },

  async logout(req, res, next) {
    try {
      res.clearCookie('accessToken')
      res.clearCookie('refreshToken')
      const response = responseSuccess(null, `Đăng xuất thành công`)
      res.status(response.statusCode).json(response)
    } catch (err) {
      next(err)
    }
  },

  async getInfo(req, res, next) {
    const result = await authService.getInfo(req)
    const response = responseSuccess(result, `Get info successfully`)
    res.status(response.statusCode).json(response)
  },
}
