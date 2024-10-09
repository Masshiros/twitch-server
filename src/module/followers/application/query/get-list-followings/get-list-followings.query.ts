type GetListFollowingsQueryParams = {
  userId: string
}
export class GetListFollowingsQuery {
  userId: string
  constructor(params: GetListFollowingsQueryParams) {
    this.userId = params.userId
  }
}
