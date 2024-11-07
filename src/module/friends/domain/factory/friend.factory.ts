import { randomUUID } from "crypto"
import { FriendRequest } from "../entity/friend-request.entity"
import { Friend } from "../entity/friend.entity"
import { EFriendRequestStatus } from "../enum/friend-request-status.enum"

interface FriendCreationProps {
  userId: string
  friendId: string
  createdAt?: Date
}

interface FriendRequestCreationProps {
  senderId: string
  receiverId: string
  status?: EFriendRequestStatus
  createdAt?: Date
}

export class FriendFactory {
  static createFriend(props: FriendCreationProps): Friend {
    return new Friend({
      userId: props.userId,
      friendId: props.friendId,
      createdAt: props.createdAt ?? new Date(),
    })
  }

  static createFriendRequest(props: FriendRequestCreationProps): FriendRequest {
    return new FriendRequest({
      senderId: props.senderId,
      receiverId: props.receiverId,
      status: props.status ?? EFriendRequestStatus.PENDING,
      createdAt: props.createdAt ?? new Date(),
    })
  }
}
