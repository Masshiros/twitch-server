type AcceptRequestCommandParams = {
  userId: string
  requestUserId: string
  groupId: string
}
export class AcceptRequestCommand {
  userId: string
  requestUserId: string
  groupId: string
  constructor(params: AcceptRequestCommandParams) {
    this.userId = params.userId
    this.requestUserId = params.requestUserId
    this.groupId = params.groupId
  }
}
