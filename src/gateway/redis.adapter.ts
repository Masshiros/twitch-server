import {
  INestApplication,
  INestApplicationContext,
  InternalServerErrorException,
} from "@nestjs/common"
import { IoAdapter } from "@nestjs/platform-socket.io"
import { createAdapter } from "@socket.io/redis-adapter"
import config from "libs/config"
import { AuthenticatedSocket } from "libs/constants/interface"
import { createClient } from "redis"
import { ServerOptions, Socket } from "socket.io"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"

export class RedisIoAdapter extends IoAdapter {
  constructor(
    private app: INestApplicationContext,
    private readonly userRepository: IUserRepository,
  ) {
    super(app)
  }
  private adapterConstructor: ReturnType<typeof createAdapter>

  async connectToRedis(): Promise<void> {
    const pubClient = createClient({ url: `redis://127.0.0.1:6379` })
    const subClient = pubClient.duplicate()

    await Promise.all([pubClient.connect(), subClient.connect()])

    this.adapterConstructor = createAdapter(pubClient, subClient)
  }

  createIOServer(port: number, options?: ServerOptions): any {
    console.log("Inside this")
    const server = super.createIOServer(port, options)
    server.adapter(this.adapterConstructor)
    server.use(async (socket: AuthenticatedSocket, next) => {
      console.log("Inside this 2")
      const token = socket.handshake.auth.token.split(" ")[1]

      if (!token) {
        socket.disconnect()
        return next(new Error("Authorization token missing"))
      }

      try {
        const decoded = await this.userRepository.decodeToken(token, {
          secret: config.JWT_SECRET_ACCESS_TOKEN,
        })

        if (!decoded) {
          socket.disconnect()
          return next(new Error("jwt expired"))
        }

        const user = await this.userRepository.findById(decoded.sub)

        if (!user) {
          socket.disconnect()
          return next(new Error("User not found "))
        }

        socket.user = user
        next()
      } catch (err) {}
    })
    return server
  }
}
