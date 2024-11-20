type GetLivestreamInfoQueryParams = {
  userId: string
}
export class GetLivestreamInfoQuery {
  userId: string
  constructor(params: GetLivestreamInfoQueryParams) {
    this.userId = params.userId
  }
}
