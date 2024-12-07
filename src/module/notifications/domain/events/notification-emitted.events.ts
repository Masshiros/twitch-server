import { IEvent } from "@nestjs/cqrs"

export class NotificationEmittedEvent implements IEvent {
  constructor(
    public readonly userId: string,
    public readonly notificationData: any,
  ) {}
}
