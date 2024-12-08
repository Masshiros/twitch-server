import { IEvent } from "@nestjs/cqrs"
import { Notification } from "../entity/notification.entity"

export class NotificationEmittedEvent implements IEvent {
  constructor(
    public readonly userIds: string[],
    public readonly notification: Notification,
  ) {}
}
