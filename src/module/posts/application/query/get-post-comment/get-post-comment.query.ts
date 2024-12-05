type GetPostCommentQueryParams = {
  postId: string
}
export class GetPostCommentQuery {
  postId: string
  constructor(params: GetPostCommentQueryParams) {
    this.postId = params.postId
  }
}
