import { IEvent } from "@nestjs/cqrs"
import { FriendRequest } from "../entity/friend-request.entity"

export class RejectFriendRequestEvent implements IEvent {
  constructor(public readonly request: FriendRequest) {}
}
