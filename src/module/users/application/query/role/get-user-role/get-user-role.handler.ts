import { QueryHandler } from "@nestjs/cqrs"
import {
  QueryError,
  QueryErrorCode,
  QueryErrorDetailCode,
} from "libs/exception/application/query"
import { InfrastructureError } from "libs/exception/infrastructure"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { RoleResult } from "../role.result"
import { GetUserRoleQuery } from "./get-user-role.query"

@QueryHandler(GetUserRoleQuery)
export class GetUserRoleHandler {
  constructor(private readonly userRepository: IUserRepository) {}
  async execute(query: GetUserRoleQuery): Promise<RoleResult[] | null> {
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
      const userRoles = await this.userRepository.getUserRoles(user)
      if (!userRoles) {
        return null
      }
      const result = userRoles.map((r) => {
        return {
          id: r.id,
          name: r.name,
          createdAt: r.createdAt,
          deletedAt: r.deletedAt,
          updatedAt: r.updatedAt,
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
