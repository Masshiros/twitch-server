export class NotificationEmittedEvent {
  constructor(
    public readonly userId: string,
    public readonly notificationData: any,
  ) {}
}
