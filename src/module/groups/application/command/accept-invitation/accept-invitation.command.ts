type AcceptInvitationCommandParams = {
  groupId: string
  userId: string
}
export class AcceptInvitationCommand {
  groupId: string
  userId: string
  constructor(params: AcceptInvitationCommandParams) {
    this.userId = params.userId
    this.groupId = params.groupId
  }
}
