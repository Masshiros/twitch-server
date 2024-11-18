type UpdateCommentCommandParams = {
  postId: string
  userId: string
  content: string
  commentId: string
}
export class UpdateCommentCommand {
  postId: string
  userId: string
  content: string
  commentId: string
  constructor(params: UpdateCommentCommandParams) {
    this.postId = params.postId
    this.userId = params.userId
    this.content = params.content
    this.commentId = params.commentId
  }
}
