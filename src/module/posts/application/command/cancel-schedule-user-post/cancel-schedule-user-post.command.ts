type CancelScheduleUserPostCommandParams = {
  postId: string
}
export class CancelScheduleUserPostCommand {
  postId: string
  constructor(params: CancelScheduleUserPostCommandParams) {
    this.postId = params.postId
  }
}
