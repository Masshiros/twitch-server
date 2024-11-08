type SendFriendRequestCommandParams = {
  senderId: string
  receiverId: string
}
export class SendFriendRequestCommand {
  senderId: string
  receiverId: string
  constructor(params: SendFriendRequestCommandParams) {
    this.senderId = params.senderId
    this.receiverId = params.receiverId
  }
}
