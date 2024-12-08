import { IEvent } from "@nestjs/cqrs"

export class AllNotificationEvent implements IEvent {
  constructor(public readonly userId: string) {}
}
