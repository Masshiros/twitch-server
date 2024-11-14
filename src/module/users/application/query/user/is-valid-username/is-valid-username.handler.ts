import { QueryHandler } from "@nestjs/cqrs"
import {
  QueryError,
  QueryErrorCode,
  QueryErrorDetailCode,
} from "libs/exception/application/query"
import { InfrastructureError } from "libs/exception/infrastructure"
import { UserFactory } from "src/module/users/domain/factory/user"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { IsValidUserNameQuery } from "./is-valid-username.query"

@QueryHandler(IsValidUserNameQuery)
export class IsValidUserNameHandler {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userFactory: UserFactory,
  ) {}
  async execute(query: IsValidUserNameQuery) {
    const { username } = query
    try {
      if (!username || username.length === 0) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: "Username can not be empty",
          info: {
            errorCode: QueryErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
          },
        })
      }
      if (await this.userRepository.findByUsername(username)) {
        return false
      }
      return true
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
