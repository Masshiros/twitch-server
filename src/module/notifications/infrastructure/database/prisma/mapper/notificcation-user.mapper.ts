import { type NotificationUser as PrismaNotificationUser } from "@prisma/client"
import { NotificationUser } from "src/module/notifications/domain/entity/notification-user.entity"

export class NotificationUserMapper {
  static toDomain(
    prismaNotificationUser: PrismaNotificationUser,
  ): NotificationUser {
    return new NotificationUser({
      receiverId: prismaNotificationUser.receiverId,
      notificationId: prismaNotificationUser.notificationId,
      hasRead: prismaNotificationUser.hasRead,
      createdAt: prismaNotificationUser.createdAt,
    })
  }

  static toPersistence(
    notificationUser: NotificationUser,
  ): PrismaNotificationUser {
    return {
      receiverId: notificationUser.receiverId,
      notificationId: notificationUser.notificationId,
      hasRead: notificationUser.hasRead,
      createdAt: notificationUser.createdAt,
    }
  }
}
