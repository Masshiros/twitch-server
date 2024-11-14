type GetPendingRequestsQueryParams = {
  groupId: string
  userId: string
  limit?: number
  offset?: number
  orderBy?: string
  order?: "asc" | "desc"
}
export class GetPendingRequestsQuery {
  groupId: string
  userId: string
  limit?: number
  offset?: number
  orderBy?: string
  order?: "asc" | "desc"
  constructor(params: GetPendingRequestsQueryParams) {
    this.groupId = params.groupId
    this.userId = params.userId
    this.limit = params.limit ?? 1
    this.offset = params.offset ?? 0
    this.orderBy = params.orderBy ?? "requestedAt"
    this.order = params.order ?? "desc"
  }
}
