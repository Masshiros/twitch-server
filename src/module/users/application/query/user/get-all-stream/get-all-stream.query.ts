type GetAllStreamQueryParams = {
  limit?: number
  offset?: number
  orderBy?: string
  order?: "asc" | "desc"
}
export class GetAllStreamQuery {
  limit: number
  offset: number
  orderBy: string
  order: "asc" | "desc"
  constructor(params: GetAllStreamQueryParams) {
    this.limit = params.limit ?? 1
    this.offset = params.offset ?? 0
    this.orderBy = params.orderBy
    this.order = params.order ?? "desc"
  }
}
