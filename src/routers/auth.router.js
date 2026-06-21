import express from 'express'
import { authController } from '../controllers/auth.controller.js'
import { authCookie } from '../common/middleware/authCookie.middleware.js'

const authRouter = express.Router()

authRouter.post('/register', authController.register)
authRouter.post('/login', authController.login)
authRouter.post('/refresh-token', authController.refreshToken)
authRouter.post('/logout', authController.logout)

authRouter.get('/profile', authCookie, authController.getInfo)

export default authRouter
