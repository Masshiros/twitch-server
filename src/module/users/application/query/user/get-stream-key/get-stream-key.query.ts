type GetStreamKeyQueryParams = {
  userId: string
}
export class GetStreamKeyQuery {
  userId: string
  constructor(params: GetStreamKeyQueryParams) {
    this.userId = params.userId
  }
}
