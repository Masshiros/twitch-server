type GetLivestreamInfoQueryParams = {
  username: string
}
export class GetLivestreamInfoQuery {
  username: string
  constructor(params: GetLivestreamInfoQueryParams) {
    this.username = params.username
  }
}
