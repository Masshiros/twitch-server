type RejectGroupPostCommandParams = {
  userId: string
  groupId: string
  groupPostId: string
}
export class RejectGroupPostCommand {
  userId: string
  groupId: string
  groupPostId: string
  constructor(params: RejectGroupPostCommandParams) {
    this.userId = params.userId
    this.groupId = params.groupId
    this.groupPostId = params.groupPostId
  }
}
