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
  constructor(app: INestApplication) {
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

    return server
  }
}
