import { IQuery } from "@nestjs/cqrs"
import { UserFilters } from "src/common/interface"

type GetAllUsersQueryParams = {
  limit?: number
  offset?: number
  filters?: UserFilters
}

export class GetAllUsersQuery implements IQuery {
  readonly filters: UserFilters
  limit: number
  offset: number

  constructor(params: GetAllUsersQueryParams) {
    this.filters = params.filters
    this.limit = params.limit ?? 10
    this.offset = params.offset ?? 0
  }
}
