import express from 'express'
import { userController } from '../controllers/user.controller.js'
import { protect } from '../common/middleware/auth.middleware.js'

const userRouter = express.Router()

userRouter.use(protect) // Áp dụng bảo mật kiểm tra token cho toàn bộ các route cá nhân bên dưới

userRouter.get('/profile', userController.getProfile)
userRouter.put('/profile', userController.updateProfile)
userRouter.get('/created-images', userController.getCreatedImages)
userRouter.get('/saved-images', userController.getSavedImages)

export default userRouter
