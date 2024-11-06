type DeleteUserPostCommandParams = {
  postId: string
  userId: string
}

export class DeleteUserPostCommand {
  postId: string
  userId: string
  constructor(params: DeleteUserPostCommandParams) {
    this.postId = params.postId
    this.userId = params.userId
  }
}
