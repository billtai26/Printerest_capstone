import { responseSuccess } from '../common/helpers/response.helper.js'
import { userService } from '../services/user.service.js'

export const userController = {
  async getProfile(req, res, next) {
    try {
      const result = await userService.getProfile(req)
      const response = responseSuccess(
        result,
        `Lấy thông tin cá nhân user thành công`,
      )
      res.status(response.statusCode).json(response)
    } catch (err) {
      next(err)
    }
  },

  async updateProfile(req, res, next) {
    try {
      const result = await userService.updateProfile(req)
      const response = responseSuccess(
        result,
        `Cập nhật thông tin cá nhân thành công`,
      )
      res.status(response.statusCode).json(response)
    } catch (err) {
      next(err)
    }
  },

  async getCreatedImages(req, res, next) {
    try {
      const result = await userService.getCreatedImages(req)
      const response = responseSuccess(
        result,
        `Lấy danh sách ảnh đã tạo thành công`,
      )
      res.status(response.statusCode).json(response)
    } catch (err) {
      next(err)
    }
  },

  async getSavedImages(req, res, next) {
    try {
      const result = await userService.getSavedImages(req)
      const response = responseSuccess(
        result,
        `Lấy danh sách ảnh đã lưu thành công`,
      )
      res.status(response.statusCode).json(response)
    } catch (err) {
      next(err)
    }
  },
}
