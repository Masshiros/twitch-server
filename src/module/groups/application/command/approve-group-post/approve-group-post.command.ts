type ApproveGroupPostCommandParams = {
  userId: string
  groupId: string
  groupPostId: string
}
export class ApproveGroupPostCommand {
  userId: string
  groupId: string
  groupPostId: string
  constructor(params: ApproveGroupPostCommandParams) {
    this.userId = params.userId
    this.groupId = params.groupId
    this.groupPostId = params.groupPostId
  }
}
