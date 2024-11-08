type GetListFriendRequestQueryParams = {
  receiverId: string
}
export class GetListFriendRequestQuery {
  receiverId: string
  constructor(params: GetListFriendRequestQueryParams) {
    this.receiverId = params.receiverId
  }
}
