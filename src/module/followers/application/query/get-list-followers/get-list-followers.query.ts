type GetListFollowersQueryParams = {
  userId: string
}
export class GetListFollowersQuery {
  userId: string
  constructor(params: GetListFollowersQueryParams) {
    this.userId = params.userId
  }
}
