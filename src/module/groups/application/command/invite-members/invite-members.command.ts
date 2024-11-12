type InviteMembersCommandParams = {
  userId: string
  groupId: string
  friendIds: string[]
}
export class InviteMembersCommand {
  userId: string
  groupId: string
  friendIds: string[]
  constructor(params: InviteMembersCommandParams) {
    this.userId = params.userId
    this.groupId = params.groupId
    this.friendIds = params.friendIds
  }
}
