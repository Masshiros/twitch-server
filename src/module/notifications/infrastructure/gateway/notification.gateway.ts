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
import { AuthenticatedSocket } from "libs/constants/interface"
import {
  InfrastructureError,
  InfrastructureErrorCode,
} from "libs/exception/infrastructure"
import { Server, Socket } from "socket.io"
import { IGatewaySessionManager } from "src/gateway/gateway.session"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { NotificationEmittedEvent } from "../../domain/events/notification-emitted.events"
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
    private readonly sessions: IGatewaySessionManager,
  ) {}
  @WebSocketServer() server: Server

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const token = client.handshake.auth.token.split(" ")[1]
      console.log(token)
      if (!token) {
        console.log("Authorization token missing")
      }

      const decoded = await this.userRepository.decodeToken(token, {
        secret: config.JWT_SECRET_ACCESS_TOKEN,
      })

      if (!decoded) {
        console.log("jwt expired")
      }

      const user = await this.userRepository.findById(decoded.sub)

      if (!user) {
        console.log("User not found")
      }
      this.sessions.setUserSocket(user.id, client)
      // console.log(`User ${client.user?.id} connected with socket ${client.id}`)
      client.emit("connected", { status: "good" })
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
      // const userId = client.user?.id
      console.log(`User  disconnected.`)
      return "disconnected"
    } catch (error) {
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  @OnEvent(Events.notification)
  async emitNotification(event: NotificationEmittedEvent) {
    const { userId, notificationData } = event
    if (userId) {
      const socket = this.sessions.getUserSocket(userId)
      socket.emit("notification", notificationData)
    }
  }
  // @SubscribeMessage("getNotifications")
  // async getNotifications(
  //   client: Socket,
  //   {
  //     limit = 1,
  //     offset = 0,
  //     orderBy = "createdAt",
  //     order = "desc",
  //   }: {
  //     limit: number
  //     offset: number
  //     orderBy: string
  //     order: "asc" | "desc"
  //   },
  // ) {
  //   const userId = this.clients.get(client.id)
  //   const user = await this.userRepository.findById(userId)
  //   if (user) {
  //     const notifications =
  //       await this.notificationRepository.getAllNotificationWithPagination(
  //         user,
  //         {
  //           limit,
  //           offset,
  //           orderBy,
  //           order,
  //         },
  //       )
  //     client.emit("getNotifications", notifications)
  //   } else {
  //     client.disconnect()
  //   }
  // }
}
