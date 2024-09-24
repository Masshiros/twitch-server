import { QueryHandler } from "@nestjs/cqrs"
import {
  QueryError,
  QueryErrorCode,
  QueryErrorDetailCode,
} from "libs/exception/application/query"
import { InfrastructureError } from "libs/exception/infrastructure"
import { UserAggregate } from "src/users/domain/aggregate"
import { UserFactory } from "src/users/domain/factory/user"
import { IUserRepository } from "src/users/domain/repository/user"
import { GetUserQuery } from "./get-user.query"
import { GetUserQueryResult } from "./get-user.result"

@QueryHandler(GetUserQuery)
export class GetUserQueryHandler {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userFactory: UserFactory,
  ) {}
  async execute(
    query: GetUserQuery,
    currentUser: { id: string; username: string },
  ): Promise<GetUserQueryResult> {
    const { id: targetUserId } = query
    try {
      const currentUserAggregte: UserAggregate | null =
        await this.userRepository.findByUsername(currentUser.username)

      if (!currentUserAggregte || currentUserAggregte.id !== currentUser.id) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: "Unauthorized",
          info: {
            errorCode: QueryErrorDetailCode.UNAUTHORIZED,
          },
        })
      }

      if (targetUserId.length === 0) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: "User id can not be empty",
          info: {
            errorCode: QueryErrorDetailCode.USER_ID_CAN_NOT_BE_EMPTY,
          },
        })
      }

      const targetUserAggregate: UserAggregate | null =
        await this.userRepository.findById(targetUserId)

      if (!targetUserAggregate) {
        throw new QueryError({
          code: QueryErrorCode.NOT_FOUND,
          message: "User not found",
          info: {
            errorCode: QueryErrorDetailCode.USER_NOT_FOUND,
          },
        })
      }

      return {
        id: targetUserAggregate.id,
        email: targetUserAggregate.email,
        username: targetUserAggregate.name,
      }
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
