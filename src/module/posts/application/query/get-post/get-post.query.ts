type GetPostQueryParams = {
  userId: string
  postId: string
}
export class GetPostQuery {
  userId: string
  postId: string
  constructor(params: GetPostQueryParams) {
    this.userId = params.userId
    this.postId = params.postId
  }
}
