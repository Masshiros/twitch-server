type GetAllRolesQueryParams = {
  limit?: number
  offset?: number
  orderBy?: string
  order?: "asc" | "desc"
}
export class GetAllRolesQuery {
  limit: number
  offset: number
  orderBy: string
  order: "asc" | "desc"
  constructor(params: GetAllRolesQueryParams) {
    this.limit = params.limit ?? 1
    this.offset = params.offset ?? 0
    this.orderBy = params.orderBy ?? "createdAt"
    this.order = params.order ?? "desc"
  }
}
