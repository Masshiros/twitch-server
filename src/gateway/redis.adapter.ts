import { INestApplication, InternalServerErrorException } from "@nestjs/common"
import { IoAdapter } from "@nestjs/platform-socket.io"
import { createAdapter } from "@socket.io/redis-adapter"
import { AuthenticatedSocket } from "libs/constants/interface"
import { InfrastructureErrorCode } from "libs/exception/infrastructure"
import { createClient } from "redis"
import { ServerOptions } from "socket.io"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import config from "../../libs/config"

export class RedisIoAdapter extends IoAdapter {
  constructor(
    private app: INestApplication,
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
    const server = super.createIOServer(port, options)
    server.adapter(this.adapterConstructor)
    server.use(async (socket: AuthenticatedSocket, next) => {
      console.log("Inside Websocket Adapter Middleware")

      const token = socket.handshake.headers["authorization"]

      if (!token) {
        console.log("Authorization token missing")
        return next(new Error("Not Authenticated. No token provided"))
      }

      try {
        const bearerToken = token.split(" ")[1]

        if (!bearerToken) {
          return next(new Error("Not Authenticated. Invalid token format"))
        }

        const decoded = await this.userRepository.decodeToken(bearerToken, {
          secret: config.JWT_SECRET_ACCESS_TOKEN,
        })
        if (!decoded) {
          return next(
            new InternalServerErrorException(
              "Jwt expired",
              JSON.stringify({
                info: {
                  errorCode: InfrastructureErrorCode.NOT_FOUND,
                },
              }),
            ),
          )
        }

        const user = await this.userRepository.findById(decoded.sub)

        if (!user) {
          return next(
            new InternalServerErrorException(
              "User not found",
              JSON.stringify({
                info: {
                  errorCode: InfrastructureErrorCode.NOT_FOUND,
                },
              }),
            ),
          )
        }

        socket.user = user

        next()
      } catch (err) {
        console.log("Invalid token", err)
        return next(new Error("Not Authenticated. Invalid or expired token"))
      }
    })
    return server
  }
}
