import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import swaggerUi from 'swagger-ui-express'

import rootRouter from './src/routers/root.router.js'
import { appError } from './src/common/helpers/appError.helper.js'
import { logAPI } from './src/common/middleware/log-api.middleware.js'
import { swaggerDocument } from './src/common/swagger/init.swagger.js'
import { initSocket } from './src/common/socket/init.socket.js'

const app = express()

app.use(express.json())

app.use(cors({ origin: ['http://localhost:3000', 'http://google.com'] }))

app.use(cookieParser())

app.use(logAPI)

app.use(express.static('public'))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use('/api', rootRouter)

app.use(appError)

const httpServer = initSocket(app)

const PORT = 3069
const server = httpServer.listen(PORT, () => {
  console.log(`Server Printerest đang chạy thành công tại port: ${PORT}`)
})

server.requestTimeout = 0
