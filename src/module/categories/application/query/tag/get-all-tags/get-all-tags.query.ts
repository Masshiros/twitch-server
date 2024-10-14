type GetAllTagsQueryParams = {
  limit?: number
  offset?: number
  orderBy?: string
  order?: "asc" | "desc"
}
export class GetAllTagsQuery {
  limit?: number
  offset?: number
  orderBy?: string
  order?: "asc" | "desc"
  constructor(params: GetAllTagsQueryParams) {
    this.limit = params.limit
    this.offset = params.offset
    this.orderBy = params.orderBy
    this.order = params.order
  }
}
