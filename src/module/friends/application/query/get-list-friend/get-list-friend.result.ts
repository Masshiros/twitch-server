export class GetListFriendResult {
  friends: {
    userId: string
    username: string
    avatar: string
    isFriend: boolean
    numberOfMutualFriends: number
  }[] = []
}
