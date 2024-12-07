import { QueryHandler } from "@nestjs/cqrs"
import {
  QueryError,
  QueryErrorCode,
  QueryErrorDetailCode,
} from "libs/exception/application/query"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { IFollowersRepository } from "src/module/followers/domain/repository/followers.interface.repository"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { IsFollowQuery } from "./is-follow.query"

@QueryHandler(IsFollowQuery)
export class IsFollowQueryHandler {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly followerRepository: IFollowersRepository,
  ) {}

  async execute(query: IsFollowQuery): Promise<boolean> {
    const { destinationFollowId, sourceFollowId } = query

    try {
      if (!destinationFollowId || !sourceFollowId) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: "Destination and source follow ids cannot be empty",
          info: {
            errorCode: QueryErrorDetailCode.ID_CAN_NOT_BE_EMPTY,
          },
        })
      }
      const sourceUser = await this.userRepository.findById(sourceFollowId)
      if (!sourceUser) {
        throw new QueryError({
          code: QueryErrorCode.NOT_FOUND,
          message: "Follower not found",
          info: {
            errorCode: QueryErrorDetailCode.USER_NOT_FOUND,
          },
        })
      }
      const destinationUser =
        await this.userRepository.findById(destinationFollowId)
      if (!destinationUser) {
        throw new QueryError({
          code: QueryErrorCode.NOT_FOUND,
          message: "User to follow not found",
          info: {
            errorCode: QueryErrorDetailCode.USER_NOT_FOUND,
          },
        })
      }
      const isFollowed = await this.followerRepository.isFollow(
        destinationFollowId,
        sourceFollowId,
      )
      console.log(isFollowed)

      return isFollowed
    } catch (err) {
      if (
        err instanceof DomainError ||
        err instanceof QueryError ||
        err instanceof InfrastructureError
      ) {
        throw err
      }

      throw new QueryError({
        code: QueryErrorCode.INTERNAL_SERVER_ERROR,
        message: err.message,
      })
    }
  }
}
