type GetAllCategoriesQueryParams = {
  limit?: number
  offset?: number
  orderBy?: string
  order?: "asc" | "desc"
}
export class GetAllCategoriesQuery {
  limit: number
  offset: number
  orderBy: string
  order: "asc" | "desc"
  constructor(params: GetAllCategoriesQueryParams) {
    this.limit = params.limit ?? 1
    this.offset = params.offset ?? 0
    this.orderBy = params.orderBy ?? "createdAt"
    this.order = params.order ?? "desc"
  }
}
