import { Notification } from "../entity/notification.entity"
import { ENotification } from "../enum/notification.enum"

interface NotificationProps {
  senderId: string
  title?: string
  message?: string
  slug?: string
  type?: ENotification
  createdAt?: Date
  updatedAt?: Date | null
  deletedAt?: Date | null
}

export class NotificationFactory {
  static create(props: NotificationProps): Notification {
    return new Notification({
      senderId: props.senderId,
      title: props.title ?? "Default Title",
      message: props.message ?? "Default Message",
      slug: props.slug ?? "default-slug",
      type: props.type ?? ENotification.USER,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? null,
      deletedAt: props.deletedAt ?? null,
    })
  }
}
