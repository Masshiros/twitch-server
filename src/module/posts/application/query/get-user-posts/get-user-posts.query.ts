type GetUserPostsQueryParams = {
  userId: string
  currentUserId: string
  limit?: number
  offset?: number
  orderBy?: string
  order?: "asc" | "desc"
}
export class GetUserPostsQuery {
  userId: string
  currentUserId: string
  limit: number
  offset: number
  orderBy: string
  order: "asc" | "desc"
  constructor(params: GetUserPostsQueryParams) {
    this.userId = params.userId
    this.currentUserId = params.currentUserId
    this.limit = params.limit ?? 1
    this.offset = params.offset ?? 0
    this.orderBy = params.orderBy ?? "createdAt"
    this.order = params.order ?? "desc"
  }
}
