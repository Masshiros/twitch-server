export class GetListMutualFriendsResult {
  mutualFriends: {
    userId: string
    username: string
    avatar: string
    isFriend: boolean
    numberOfMutualFriends: number
  }[]
}
