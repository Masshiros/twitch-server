type RejectRequestCommandParams = {
  userId: string
  requestUserId: string
  groupId: string
}
export class RejectRequestCommand {
  userId: string
  requestUserId: string
  groupId: string
  constructor(params: RejectRequestCommandParams) {
    this.userId = params.userId
    this.requestUserId = params.requestUserId
    this.groupId = params.groupId
  }
}
