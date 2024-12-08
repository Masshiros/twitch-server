type GetConversationsQueryParams = {
  userId: string
}
export class GetConversationsQuery {
  userId: string
  constructor(params: GetConversationsQueryParams) {
    this.userId = params.userId
  }
}
