type GetUserFeedQueryParams = {
  userId: string
}
export class GetUserFeedQuery {
  userId: string

  constructor(params) {
    this.userId = params.userId
  }
}
