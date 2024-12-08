import { Injectable } from "@nestjs/common"
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter"
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
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
import { ImageService } from "src/module/image/application/image.service"
import { EImageType } from "src/module/image/domain/enum/image-type.enum"
import { AllNotificationEvent } from "src/module/notifications/domain/events/all-notification.event"
import { NotificationEmittedEvent } from "src/module/notifications/domain/events/notification-emitted.events"
import { INotificationRepository } from "src/module/notifications/domain/repositories/notification.interface.repository"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { IGatewaySessionManager } from "./gateway.session"

WebSocketGateway({
  cors: {
    origin: "*",
  },
})
@Injectable()
export class Gateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly notificationRepository: INotificationRepository,
    private readonly userRepository: IUserRepository,
    private readonly sessions: IGatewaySessionManager,
    private readonly imageService: ImageService,
    private readonly emitter: EventEmitter2,
  ) {}
  @WebSocketServer() server: Server

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const token = client.handshake.auth.token.split(" ")[1]
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
      if (user) {
        this.emitter.emit(
          Events.notification_all,
          new AllNotificationEvent(user.id),
        )
      }
      // console.log(`User connected with socket ${client.id}`)
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
  @OnEvent(Events.notification)
  async emitNotification(event: NotificationEmittedEvent) {
    const { userIds, notification } = event
    if (userIds && userIds !== undefined && userIds.length > 0) {
      userIds.map(async (e) => {
        const user = await this.userRepository.findById(e)
        const userImages = await this.imageService.getImageByApplicableId(
          user.id,
        )
        const userAvatar = userImages.find(
          (e) => e.imageType === EImageType.AVATAR,
        )
        const socket = this.sessions.getUserSocket(e)
        await this.notificationRepository.addNotificationUser(
          notification,
          user,
        )
        socket.emit("notification", {
          senderName: user.name,
          senderAvatar: userAvatar,
          type: notification.type,
          createdAt: notification.createdAt,
          message: notification.message,
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
          const user = await this.userRepository.findById(e.senderId)
          const userImages = await this.imageService.getImageByApplicableId(
            user.id,
          )
          const userAvatar = userImages?.find(
            (e) => e.imageType === EImageType.AVATAR,
          )
          return {
            senderName: user?.name ?? "",
            senderAvatar: userAvatar?.url ?? "",
            message: e.message,
            type: e.type,
            createdAt: e.createdAt,
          }
        }),
      )
      socket.emit("getNotifications", result)
    } else {
      socket.disconnect()
    }
  }
}
