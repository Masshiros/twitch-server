type GetUserPostsQueryParams = {
  username: string
  currentUserId?: string
  limit?: number
  offset?: number
  orderBy?: string
  order?: "asc" | "desc"
}
export class GetUserPostsQuery {
  username: string
  currentUserId?: string
  limit: number
  offset: number
  orderBy: string
  order: "asc" | "desc"
  constructor(params: GetUserPostsQueryParams) {
    this.username = params.username
    this.currentUserId = params.currentUserId ?? ""
    this.limit = params.limit ?? 1
    this.offset = params.offset ?? 0
    this.orderBy = params.orderBy ?? "createdAt"
    this.order = params.order ?? "desc"
  }
}
