type CreateCommentCommandParams = {
  postId: string
  userId: string
  content: string
  parentId?: string
}
export class CreateCommentCommand {
  postId: string
  userId: string
  content: string
  parentId?: string
  constructor(params: CreateCommentCommandParams) {
    this.postId = params.postId
    this.userId = params.userId
    this.content = params.content
    this.parentId = params.parentId
  }
}
