type GetListLoginHistoriesQueryParams = {
  userId: string
}
export class GetListLoginHistoriesQuery {
  userId: string
  constructor(params: GetListLoginHistoriesQueryParams) {
    this.userId = params.userId
  }
}
