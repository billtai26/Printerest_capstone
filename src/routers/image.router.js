import express from 'express'
import { imageController } from '../controllers/image.controller.js'
import { protect } from '../common/middleware/auth.middleware.js'

const imageRouter = express.Router()

imageRouter.get('/', imageController.getAllImages)
imageRouter.get('/:id', imageController.getImageDetail)
imageRouter.get('/:id/comments', imageController.getCommentsByImage)

// Các API cần đăng nhập bằng token (Sử dụng middleware protect từ dự án của bạn)
imageRouter.get('/:id/check-saved', protect, imageController.checkImageSaved)
imageRouter.post('/:id/comment', protect, imageController.addComment)
imageRouter.post('/:id/save', protect, imageController.toggleSaveImage)
imageRouter.post('/', protect, imageController.createImage)
imageRouter.delete('/:id', protect, imageController.deleteImage)

export default imageRouter
