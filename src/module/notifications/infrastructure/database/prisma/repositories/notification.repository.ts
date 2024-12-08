import { Injectable } from "@nestjs/common"
import { Prisma } from "@prisma/client"
import {
  InfrastructureError,
  InfrastructureErrorCode,
} from "libs/exception/infrastructure"
import { PrismaService } from "prisma/prisma.service"
import { NotificationUser } from "src/module/notifications/domain/entity/notification-user.entity"
import { Notification } from "src/module/notifications/domain/entity/notification.entity"
import { INotificationRepository } from "src/module/notifications/domain/repositories/notification.interface.repository"
import { UserAggregate } from "src/module/users/domain/aggregate"
import { handlePrismaError } from "utils/prisma-error"
import { NotificationMapper } from "../mapper/notification.mapper"
import { NotificationUserMapper } from "../mapper/notificcation-user.mapper"

@Injectable()
export class NotificationRepository implements INotificationRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async getNotificationById(
    notificationId: string,
  ): Promise<Notification | null> {
    try {
      const notification = await this.prismaService.notification.findUnique({
        where: { id: notificationId },
      })
      if (!notification) {
        return null
      }
      return NotificationMapper.toDomain(notification) ?? null
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async addNotification(notification: Notification): Promise<void> {
    try {
      const data = NotificationMapper.toPersistence(notification)
      const existNoti = await this.prismaService.notification.findUnique({
        where: { id: data.id },
      })
      if (existNoti) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
          message: "Already exist this data",
        })
      }
      console.log(data)
      await this.prismaService.notification.create({ data })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      console.log(error)
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async addNotificationUser(
    notification: Notification,
    receiver: UserAggregate,
  ): Promise<void> {
    try {
      const noti = NotificationMapper.toPersistence(notification)
      const existNoti = await this.prismaService.notification.findUnique({
        where: { id: noti.id },
      })
      if (!existNoti && existNoti === undefined) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
          message: "No exist notification.Try again",
        })
      }
      const data = NotificationUserMapper.toPersistence(
        new NotificationUser({
          notificationId: noti.id,
          receiverId: receiver.id,
          hasRead: false,
        }),
      )
      await this.prismaService.notificationUser.create({ data: data })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async getAllNotificationWithPagination(
    receiver: UserAggregate,

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
  ): Promise<Notification[] | null> {
    try {
      const notificationUserEntries =
        await this.prismaService.notificationUser.findMany({
          where: {
            receiverId: receiver.id,
          },
          select: {
            notificationId: true,
          },
          ...(offset !== null ? { skip: offset } : {}),
          ...(limit !== null ? { take: limit } : {}),
        })
      if (!notificationUserEntries.length) {
        return []
      }
      const notificationIds = notificationUserEntries.map(
        (entry) => entry.notificationId,
      )
      const notifications = await this.prismaService.notification.findMany({
        where: {
          id: { in: notificationIds },
        },
        ...(orderBy !== null ? { orderBy: { [orderBy]: order } } : {}),
      })
      const result = notifications.map((prismaNotification) =>
        NotificationMapper.toDomain(prismaNotification),
      )

      return result ?? null
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async markAsRead(
    notification: Notification,
    receiver: UserAggregate,
  ): Promise<void> {
    try {
      await this.prismaService.notificationUser.update({
        where: {
          receiverId_notificationId: {
            notificationId: notification.id,
            receiverId: receiver.id,
          },
        },
        data: { hasRead: true },
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
}
