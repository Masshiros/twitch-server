import { NotificationUser } from "../entity/notification-user.entity"

interface NotificationUserProps {
  receiverId: string
  notificationId: string
  hasRead: boolean
  createdAt?: Date
}

export class NotificationUserFactory {
  static create(props: NotificationUserProps): NotificationUser {
    return new NotificationUser({
      receiverId: props.receiverId,
      notificationId: props.notificationId,
      hasRead: props.hasRead,
      createdAt: props.createdAt || new Date(),
    })
  }
}
