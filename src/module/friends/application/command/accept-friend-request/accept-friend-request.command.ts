type AcceptFriendRequestCommandParams = {
  senderId: string
  receiverId: string
}
export class AcceptFriendRequestCommand {
  senderId: string
  receiverId: string
  constructor(params: AcceptFriendRequestCommandParams) {
    this.senderId = params.senderId
    this.receiverId = params.receiverId
  }
}
