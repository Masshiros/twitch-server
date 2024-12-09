import { IEvent } from "@nestjs/cqrs"

export class ListFriendEvent implements IEvent {
  constructor(public readonly userId: string) {}
}
