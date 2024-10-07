import { QueryHandler } from "@nestjs/cqrs"
import { plainToInstance } from "class-transformer"
import {
  QueryError,
  QueryErrorCode,
  QueryErrorDetailCode,
} from "libs/exception/application/query"
import { InfrastructureError } from "libs/exception/infrastructure"
import { UserAggregate } from "src/module/users/domain/aggregate"
import { UserFactory } from "src/module/users/domain/factory/user"
import { IUserRepository } from "src/module/users/domain/repository/user"
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
    //currentUser: { id: string; username: string },
  ): Promise<GetUserQueryResult | null> {
    const { id: targetUserId } = query
    try {
      // const currentUserAggregte: UserAggregate | null =
      //   await this.userRepository.findByUsername(currentUser.username)

      // if (!currentUserAggregte || currentUserAggregte.id !== currentUser.id) {
      //   throw new QueryError({
      //     code: QueryErrorCode.BAD_REQUEST,
      //     message: "Unauthorized",
      //     info: {
      //       errorCode: QueryErrorDetailCode.UNAUTHORIZED,
      //     },
      //   })
      // }

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

      return { result: targetUserAggregate }
    } catch (err) {
      console.error(err.stack)
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
