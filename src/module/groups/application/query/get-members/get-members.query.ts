type GetMembersQueryParams = {
  groupId: string
  userId: string
}
export class GetMembersQuery {
  groupId: string
  userId: string
  constructor(params: GetMembersQueryParams) {
    this.userId = params.userId
    this.groupId = params.groupId
  }
}
