type RemoveFriendCommandParams = {
  userId: string
  friendId: string
}
export class RemoveFriendCommand {
  userId: string
  friendId: string
  constructor(params: RemoveFriendCommandParams) {
    this.userId = params.userId
    this.friendId = params.friendId
  }
}
