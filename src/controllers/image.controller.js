import { responseSuccess } from '../common/helpers/response.helper.js'
import { imageService } from '../services/image.service.js'

export const imageController = {
  async getAllImages(req, res, next) {
    try {
      const result = await imageService.getAllImages(req)
      const response = responseSuccess(
        result,
        `Lấy danh sách hình ảnh thành công`,
      )
      res.status(response.statusCode).json(response)
    } catch (err) {
      next(err)
    }
  },

  async getImageDetail(req, res, next) {
    try {
      const result = await imageService.getImageDetail(req)
      const response = responseSuccess(
        result,
        `Lấy chi tiết hình ảnh thành công`,
      )
      res.status(response.statusCode).json(response)
    } catch (err) {
      next(err)
    }
  },

  async getCommentsByImage(req, res, next) {
    try {
      const result = await imageService.getCommentsByImage(req)
      const response = responseSuccess(
        result,
        `Lấy danh sách bình luận thành công`,
      )
      res.status(response.statusCode).json(response)
    } catch (err) {
      next(err)
    }
  },

  async checkImageSaved(req, res, next) {
    try {
      const result = await imageService.checkImageSaved(req)
      const response = responseSuccess(
        result,
        `Kiểm tra trạng thái lưu ảnh thành công`,
      )
      res.status(response.statusCode).json(response)
    } catch (err) {
      next(err)
    }
  },

  async addComment(req, res, next) {
    try {
      const result = await imageService.addComment(req)
      const response = responseSuccess(result, `Đăng bình luận thành công`)
      res.status(response.statusCode).json(response)
    } catch (err) {
      next(err)
    }
  },

  async toggleSaveImage(req, res, next) {
    try {
      const result = await imageService.toggleSaveImage(req)
      const response = responseSuccess(result, result.message)
      res.status(response.statusCode).json(response)
    } catch (err) {
      next(err)
    }
  },

  async createImage(req, res, next) {
    try {
      const result = await imageService.createImage(req)
      const response = responseSuccess(
        result,
        `Đăng tải hình ảnh mới thành công`,
      )
      res.status(response.statusCode).json(response)
    } catch (err) {
      next(err)
    }
  },

  async deleteImage(req, res, next) {
    try {
      await imageService.deleteImage(req)
      const response = responseSuccess(null, `Xóa hình ảnh thành công`)
      res.status(response.statusCode).json(response)
    } catch (err) {
      next(err)
    }
  },
}
