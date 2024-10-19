import { QueryHandler } from "@nestjs/cqrs"
import { QueryError, QueryErrorCode } from "libs/exception/application/query"
import { InfrastructureError } from "libs/exception/infrastructure"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { PermissionResult } from "../permission.result"
import { GetAllPermissionsQuery } from "./get-all-permissions.query"

@QueryHandler(GetAllPermissionsQuery)
export class GetAllPermissionsHandler {
  constructor(private readonly userRepository: IUserRepository) {}
  async execute(
    query: GetAllPermissionsQuery,
  ): Promise<PermissionResult[] | null> {
    const { limit, offset, order, orderBy } = query
    try {
      const permissions =
        await this.userRepository.getAllPermissionsWithPagination({
          limit,
          offset,
          orderBy,
          order,
        })
      if (!permissions) {
        return null
      }
      const result = permissions.map((e) => {
        return {
          id: e.id,
          name: e.name,
          description: e.description,
          createdAt: e.createdAt,
          updatedAt: e.updatedAt,
          deletedAt: e.deletedAt,
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
