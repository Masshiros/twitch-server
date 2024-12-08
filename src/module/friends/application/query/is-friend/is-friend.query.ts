type IsFriendQueryParams = {
  userId: string
  friendName: string
}
export class IsFriendQuery {
  userId: string
  friendName: string
  constructor(params: IsFriendQueryParams) {
    this.userId = params.userId
    this.friendName = params.friendName
  }
}
