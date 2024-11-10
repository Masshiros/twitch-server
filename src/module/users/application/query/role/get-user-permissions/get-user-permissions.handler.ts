import { QueryHandler } from "@nestjs/cqrs"
import {
  QueryError,
  QueryErrorCode,
  QueryErrorDetailCode,
} from "libs/exception/application/query"
import { InfrastructureError } from "libs/exception/infrastructure"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { PermissionResult } from "../permission.result"
import { GetUserPermissionsQuery } from "./get-user-permissions.query"

@QueryHandler(GetUserPermissionsQuery)
export class GetUserPermissionsHandler {
  constructor(private readonly userRepository: IUserRepository) {}
  async execute(
    query: GetUserPermissionsQuery,
  ): Promise<PermissionResult[] | null> {
    const { userId } = query
    try {
      if (!userId || userId.length === 0) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: "User id can not be empty",
          info: {
            errorCode: QueryErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
          },
        })
      }
      const user = await this.userRepository.findById(userId)
      if (!user) {
        throw new QueryError({
          code: QueryErrorCode.NOT_FOUND,
          message: "User not found",
          info: {
            errorCode: QueryErrorDetailCode.USER_NOT_FOUND,
          },
        })
      }
      const userPermissions = await this.userRepository.getUserPermissions(user)
      if (!userPermissions) {
        return null
      }
      const result = userPermissions.map((p) => {
        return {
          id: p.id,
          name: p.name,
          description: p.description,
          createdAt: p.createdAt,
          deletedAt: p.deletedAt,
          updatedAt: p.updatedAt,
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
