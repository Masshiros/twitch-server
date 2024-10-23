import {
  ENotification,
  type Notification as PrismaNotification,
} from "@prisma/client"
import { Notification } from "src/module/notifications/domain/entity/notification.entity"
import { ENotification as DomainENotification } from "src/module/notifications/domain/enum/notification.enum"

export class NotificationMapper {
  static toDomain(prismaNotification: PrismaNotification): Notification {
    return new Notification(
      {
        senderId: prismaNotification.senderId,
        title: prismaNotification.title,
        message: prismaNotification.message,
        slug: prismaNotification.slug,
        type: this.mapPrismaToDomainEnum(prismaNotification.type),
        createdAt: prismaNotification.createdAt,
        updatedAt: prismaNotification.updatedAt,
      },
      prismaNotification.id,
    )
  }

  static toPersistence(notification: Notification): PrismaNotification {
    return {
      id: notification.id,
      senderId: notification.senderId,
      title: notification.title,
      message: notification.message,
      slug: notification.slug,
      type: this.mapDomainToPrismaEnum(notification.type),
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
      deletedAt: notification.deletedAt,
    }
  }

  private static mapPrismaToDomainEnum(
    prismaEnum: ENotification,
  ): DomainENotification {
    switch (prismaEnum) {
      case "USER":
        return DomainENotification.USER
      case "LIVESTREAM":
        return DomainENotification.LIVESTREAM
      case "CHAT":
        return DomainENotification.CHAT
      default:
        throw new Error(`Unknown Prisma Enum value: ${prismaEnum}`)
    }
  }

  private static mapDomainToPrismaEnum(
    domainEnum: DomainENotification,
  ): ENotification {
    switch (domainEnum) {
      case DomainENotification.USER:
        return "USER"
      case DomainENotification.LIVESTREAM:
        return "LIVESTREAM"
      case DomainENotification.CHAT:
        return "CHAT"
      default:
        throw new Error(`Unknown Domain Enum value: ${domainEnum}`)
    }
  }
}
