import { EFriendRequestStatus } from "src/module/friends/domain/enum/friend-request-status.enum"

export class GetListFriendRequestsResult {
  friendRequests: {
    sender: {
      senderId: string
      username: string
      avatar: string
    }
    status: EFriendRequestStatus
    sentAt: Date
  }[] = []
}
