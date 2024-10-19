type GetAllPermissionsQueryParams = {
  limit?: number
  offset?: number
  orderBy?: string
  order?: "asc" | "desc"
}
export class GetAllPermissionsQuery {
  limit: number
  offset: number
  orderBy: string
  order: "asc" | "desc"
  constructor(params: GetAllPermissionsQueryParams) {
    this.limit = params.limit ?? 1
    this.offset = params.offset ?? 0
    this.orderBy = params.orderBy ?? "createdAt"
    this.order = params.order ?? "desc"
  }
}
