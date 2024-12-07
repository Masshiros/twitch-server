import { Injectable } from "@nestjs/common"
import { OnEvent } from "@nestjs/event-emitter"
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets"
import config from "libs/config"
import { Events } from "libs/constants/events"
import {
  InfrastructureError,
  InfrastructureErrorCode,
} from "libs/exception/infrastructure"
import { Server, Socket } from "socket.io"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { INotificationRepository } from "../../domain/repositories/notification.interface.repository"

@WebSocketGateway({
  cors: {
    origin: "*",
  },
  namespace: "notifications",
})
@Injectable()
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly notificationRepository: INotificationRepository,
    private readonly userRepository: IUserRepository,
  ) {}
  @WebSocketServer() server: Server
  private clients: Map<string, string> = new Map()
  async handleConnection(client: Socket, ...args: any[]) {
    try {
      console.log("Connected")
      console.log(client)
      console.log(client.handshake)
      const token = client.handshake.headers?.authorization?.split(" ")[1]
      if (!token) {
        client.disconnect()
        return
      }
      const payload = await this.userRepository.decodeToken(token, {
        secret: config.JWT_SECRET_ACCESS_TOKEN,
      })
      if (!payload || !payload.sub) {
        client.disconnect()
        return
      }
      this.clients.set(client.id, payload.sub)
      console.log(`User ${payload.sub} connected with socket ${client.id}`)
      // console.log(`User connected with socket ${client.id}`)
    } catch (error) {
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  handleDisconnect(client: Socket) {
    try {
      const userId = this.clients.get(client.id)
      this.clients.delete(userId)
      console.log(`User ${userId} disconnected.`)
    } catch (error) {
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  @OnEvent(Events.notification)
  async emitNotification(userId: string, data: any) {
    const socketId = [...this.clients.entries()].find(
      ([, id]) => id === userId,
    )?.[0]
    if (!socketId) {
      this.server.to(socketId).emit("notification", data)
    }
  }
  @SubscribeMessage("getNotifications")
  async getNotifications(
    client: Socket,
    {
      limit = 1,
      offset = 0,
      orderBy = "createdAt",
      order = "desc",
    }: {
      limit: number
      offset: number
      orderBy: string
      order: "asc" | "desc"
    },
  ) {
    const userId = this.clients.get(client.id)
    const user = await this.userRepository.findById(userId)
    if (user) {
      const notifications =
        await this.notificationRepository.getAllNotificationWithPagination(
          user,
          {
            limit,
            offset,
            orderBy,
            order,
          },
        )
      client.emit("getNotifications", notifications)
    } else {
      client.disconnect()
    }
  }
}
