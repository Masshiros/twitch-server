import { QueryHandler } from "@nestjs/cqrs"
import { QueryError, QueryErrorCode } from "libs/exception/application/query"
import { InfrastructureError } from "libs/exception/infrastructure"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { RoleResult } from "../role.result"
import { GetAllRolesQuery } from "./get-all-role.query"

@QueryHandler(GetAllRolesQuery)
export class GetAllRolesHandler {
  constructor(private readonly userRepository: IUserRepository) {}
  async execute(query: GetAllRolesQuery): Promise<RoleResult[] | null> {
    const { limit, offset, order, orderBy } = query
    try {
      const roles = await this.userRepository.getAllRolesWithPagination({
        limit,
        offset,
        orderBy,
        order,
      })
      if (!roles) {
        return null
      }
      const result = roles.map((role) => {
        return {
          id: role.id,
          name: role.name,
          createdAt: role.createdAt,
          updatedAt: role.updatedAt,
          deletedAt: role.deletedAt,
        }
      })
      return result ?? null
    } catch (err) {
      if (err instanceof QueryError || err instanceof InfrastructureError) {
        throw err
      }

      throw new QueryError({
        code: QueryErrorCode.INTERNAL_SERVER_ERROR,
        message: err.message,
      })
    }
  }
}
