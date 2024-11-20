type UpdateCommentCommandParams = {
  userId: string
  content: string
  commentId: string
}
export class UpdateCommentCommand {
  userId: string
  content: string
  commentId: string
  constructor(params: UpdateCommentCommandParams) {
    this.userId = params.userId
    this.content = params.content
    this.commentId = params.commentId
  }
}
