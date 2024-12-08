import { IEvent } from "@nestjs/cqrs"

export class ListFriendRequestEvent implements IEvent {
  constructor(public readonly receiverId: string) {}
}
