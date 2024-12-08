import { IEvent } from "@nestjs/cqrs"
import { FriendRequest } from "../entity/friend-request.entity"

export class AcceptFriendRequestEvent implements IEvent {
  constructor(public readonly request: FriendRequest) {}
}
