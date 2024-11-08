export class GetListFriendRequestsResult {
  friendRequests: {
    sender: {
      senderId: string
      username: string
      avatar: string
    }
    sentAt: string
  }[]
}
