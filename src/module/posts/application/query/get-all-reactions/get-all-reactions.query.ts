type GetAllReactionsQueryParams = {
  postId: string
}
export class GetAllReactionsQuery {
  postId: string
  constructor(params: GetAllReactionsQueryParams) {
    this.postId = params.postId
  }
}
