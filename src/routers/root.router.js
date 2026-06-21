import express from 'express'
import authRouter from './auth.router.js'

const rootRouter = express.Router()

rootRouter.use('/auth', authRouter)

rootRouter.get('/check', (req, res) =>
  res.json({ message: 'API Pinterest đang hoạt động tốt!' }),
)

export default rootRouter
