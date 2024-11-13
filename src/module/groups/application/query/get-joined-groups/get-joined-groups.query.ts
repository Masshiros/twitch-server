type GetJoinedGroupQueryParams = {
  userId: string
  limit?: number
  offset?: number
  orderBy?: string
  order?: "asc" | "desc"
}
export class GetJoinedGroupQuery {
  userId: string
  limit?: number
  offset?: number
  orderBy?: string
  order?: "asc" | "desc"
  constructor(params: GetJoinedGroupQueryParams) {
    this.userId = params.userId

    this.limit = params.limit ?? 1
    this.offset = params.offset ?? 0
    this.orderBy = params.orderBy ?? "createdAt"
    this.order = params.order ?? "desc"
  }
}
