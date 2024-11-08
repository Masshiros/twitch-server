type GetListFriendQueryParams = {
  userId: string
  currentUserId: string
}
export class GetListFriendQuery {
  userId: string
  currentUserId: string
  constructor(params: GetListFriendQueryParams) {
    this.userId = params.userId
    this.currentUserId = params.currentUserId
  }
}
