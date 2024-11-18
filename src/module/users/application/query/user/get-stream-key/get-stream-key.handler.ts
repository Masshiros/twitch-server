import { QueryHandler } from "@nestjs/cqrs"
import {
  QueryError,
  QueryErrorCode,
  QueryErrorDetailCode,
} from "libs/exception/application/query"
import { InfrastructureError } from "libs/exception/infrastructure"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { GetStreamKeyQuery } from "./get-stream-key.query"

@QueryHandler(GetStreamKeyQuery)
export class GetStreamKeyHandler {
  constructor(private readonly userRepository: IUserRepository) {}
  async execute(query: GetStreamKeyQuery) {
    const { userId } = query
    try {
      if (!userId && userId.length === 0) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: "User id can not be empty",
          info: {
            errorCode: QueryErrorDetailCode.USER_ID_CAN_NOT_BE_EMPTY,
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
      console.log(user)
      return {
        streamKey: user.streamKey ?? "",
        serverUrl: user.serverUrl ?? "",
      }
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
