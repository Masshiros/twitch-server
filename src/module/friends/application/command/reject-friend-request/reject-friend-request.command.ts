type RejectFriendRequestCommandParams = {
  senderId: string
  receiverId: string
}
export class RejectFriendRequestCommand {
  senderId: string
  receiverId: string
  constructor(params: RejectFriendRequestCommandParams) {
    this.senderId = params.senderId
    this.receiverId = params.receiverId
  }
}
