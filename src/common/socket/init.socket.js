import { createServer } from 'http'
import { Server } from 'socket.io'

export const initSocket = (app) => {
  const httpServer = createServer(app)
  const io = new Server(httpServer, {
    cors: { origin: '*' },
  })

  io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`)
  })

  return httpServer
}
