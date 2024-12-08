import { Server } from "http"
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter"
import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets"
import config from "libs/config"
import { Events } from "libs/constants/events"
import { SocketEvents } from "libs/constants/socket-events"
import {
  InfrastructureError,
  InfrastructureErrorCode,
} from "libs/exception/infrastructure"
import { Socket } from "socket.io"
import { IGatewaySessionManager } from "src/gateway/gateway.session"
import { ImageService } from "src/module/image/application/image.service"
import { EImageType } from "src/module/image/domain/enum/image-type.enum"
import { AllNotificationEvent } from "src/module/notifications/domain/events/all-notification.event"
import { NotificationEmittedEvent } from "src/module/notifications/domain/events/notification-emitted.events"
import { INotificationRepository } from "src/module/notifications/domain/repositories/notification.interface.repository"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class ChatGateway implements OnGatewayConnection {
  constructor(
    private readonly notificationRepository: INotificationRepository,
    private readonly userRepository: IUserRepository,
    private readonly sessions: IGatewaySessionManager,
    private readonly imageService: ImageService,
    private readonly emitter: EventEmitter2,
  ) {}
  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const token = client.handshake.auth.token.split(" ")[1]
      // console.log(token)
      // console.log(token)
      if (!token) {
        client.disconnect()
        return "Authorization token missing"
      }

      const decoded = await this.userRepository.decodeToken(token, {
        secret: config.JWT_SECRET_ACCESS_TOKEN,
      })

      if (!decoded) {
        client.disconnect()
        return "jwt expired"
      }

      const user = await this.userRepository.findById(decoded.sub)

      if (!user) {
        client.disconnect()
        return "User not found"
      }
      this.sessions.setUserSocket(user.id, client)
      // console.log(this.sessions)
      if (user) {
        console.log("first")
        this.emitter.emit(
          Events.notification_all,
          new AllNotificationEvent(user.id),
        )
      }
    } catch (error) {
      client.disconnect()
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  handleDisconnect(client: Socket) {
    try {
      // const userId = client.user?.id
      console.log(`User disconnected.`)
    } catch (error) {
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  @WebSocketServer()
  server: Server
  @OnEvent(Events.notification)
  async emitNotification(event: NotificationEmittedEvent) {
    const { userIds, notification, data } = event
    if (userIds && userIds !== undefined && userIds.length > 0) {
      userIds.map(async (e) => {
        // console.log("USERID", e)
        const [sender, receiver] = await Promise.all([
          this.userRepository.findById(notification.senderId),
          this.userRepository.findById(e),
        ])
        const senderImages = await this.imageService.getImageByApplicableId(
          sender.id,
        )
        const senderAvatar = senderImages.find(
          (e) => e.imageType === EImageType.AVATAR,
        )
        const socket = this.sessions.getUserSocket(e)
        await this.notificationRepository.addNotificationUser(
          notification,
          receiver,
        )
        socket.emit("notification", {
          senderName: sender.name,
          senderAvatar: senderAvatar,
          type: notification.type,
          createdAt: notification.createdAt,
          message: notification.message,
          data,
        })
      })
    }
  }
  @OnEvent(Events.notification_all)
  async getNotifications(event: AllNotificationEvent) {
    const { userId } = event

    const user = await this.userRepository.findById(userId)

    const socket = this.sessions.getUserSocket(userId)
    if (user && socket) {
      const notifications =
        await this.notificationRepository.getAllNotificationWithPagination(
          user,
          {
            orderBy: "createdAt",
            order: "desc",
          },
        )

      if (notifications.length === 0) {
        socket.emit("getNotifications", "No notification to display")
      }

      const result = await Promise.all(
        notifications.map(async (e) => {
          const user = await this.userRepository.findById(e._senderId)

          const userImages = await this.imageService.getImageByApplicableId(
            user.id,
          )
          const userAvatar = userImages?.find(
            (e) => e.imageType === EImageType.AVATAR,
          )
          return {
            senderName: user?.name ?? "",
            senderAvatar: userAvatar?.url ?? "",
            message: e._message,
            type: e._type,
            createdAt: e._createdAt,
            hasRead: e.hasRead,
          }
        }),
      )

      socket.emit("getNotifications", result)
    } else {
      socket.disconnect()
    }
  }
}
