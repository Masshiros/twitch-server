type RejectInvitationCommandParams = {
  groupId: string
  userId: string
}
export class RejectInvitationCommand {
  groupId: string
  userId: string
  constructor(params: RejectInvitationCommandParams) {
    this.userId = params.userId
    this.groupId = params.groupId
  }
}
