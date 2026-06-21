import express from 'express'
const rootRouter = express.Router()

rootRouter.get('/check', (req, res) =>
  res.json({ message: 'API Pinterest hoạt động tốt!' }),
)

export default rootRouter
