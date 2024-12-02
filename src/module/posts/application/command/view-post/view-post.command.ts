type ViewPostCommandParams = {
  postId: string
}
export class ViewPostCommand {
  postId: string
  constructor(params: ViewPostCommandParams) {
    this.postId = params.postId
  }
}
