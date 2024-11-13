type GetGroupQueryParams = {
  userId: string
  groupId: string
}
export class GetGroupQuery {
  userId: string
  groupId: string
  constructor(params: GetGroupQueryParams) {
    this.userId = params.userId
    this.groupId = params.groupId
  }
}
