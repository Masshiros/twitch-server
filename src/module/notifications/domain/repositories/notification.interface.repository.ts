import { UserAggregate } from "src/module/users/domain/aggregate"
import { Notification } from "../entity/notification.entity"

export abstract class INotificationRepository {
  getNotificationById: (notificationId: string) => Promise<Notification | null>
  addNotification: (notification: Notification) => Promise<void>
  addNotificationUser: (
    notification: Notification,
    sender: UserAggregate,
  ) => Promise<void>
  getAllNotificationWithPagination: (
    receiver: UserAggregate,
    {
      limit,
      offset,
      orderBy,
      order,
    }: {
      limit: number
      offset: number
      orderBy: string
      order: "asc" | "desc"
    },
  ) => Promise<Notification[] | null>
  markAsRead: (
    notification: Notification,
    receiver: UserAggregate,
  ) => Promise<void>
}
