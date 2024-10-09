import { QueryHandler } from "@nestjs/cqrs"
import { QueryError, QueryErrorCode } from "libs/exception/application/query"
import { InfrastructureError } from "libs/exception/infrastructure"
import { UserFactory } from "src/module/users/domain/factory/user"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { GetAllUsersQuery } from "./get-all-user.query"
import { GetAllUsersQueryResult } from "./get-all-user.result"

@QueryHandler(GetAllUsersQuery)
export class GetAllUsersQueryHandler {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userFactory: UserFactory,
  ) {}
  async execute(
    query: GetAllUsersQuery,
  ): Promise<GetAllUsersQueryResult | null> {
    const { limit, offset, filters } = query

    try {
      const result = await this.userRepository.getAllWithPagination({
        limit,
        offset,
        filters,
      })
      return { result }
    } catch (err) {
      console.error(err.stack)
      if (err instanceof QueryError || err instanceof InfrastructureError) {
        throw err
      }

      throw new QueryError({
        code: QueryErrorCode.INTERNAL_SERVER_ERROR,
        message: "Internal Server Error",
      })
    }
  }
}
