type GetMutualFriendsQueryParams = {
  currentUserId: string
  userId: string
}
export class GetMutualFriendsQuery {
  currentUserId: string
  userId: string
  constructor(params: GetMutualFriendsQueryParams) {
    this.currentUserId = params.currentUserId
    this.userId = params.userId
  }
}
