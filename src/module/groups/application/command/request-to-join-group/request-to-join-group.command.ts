type RequestToJoinGroupCommandParams = {
  userId: string
  groupId: string
}
export class RequestToJoinGroupCommand {
  userId: string
  groupId: string
  constructor(params: RequestToJoinGroupCommandParams) {
    this.userId = params.userId
    this.groupId = params.groupId
  }
}
