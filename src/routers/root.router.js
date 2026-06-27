import express from 'express'
import authRouter from './auth.router.js'
import imageRouter from './image.router.js'

const rootRouter = express.Router()

rootRouter.use('/auth', authRouter)
rootRouter.use('/images', imageRouter)

export default rootRouter
