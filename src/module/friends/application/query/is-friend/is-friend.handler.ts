import { QueryHandler } from "@nestjs/cqrs"
import { query } from "express"
import {
  QueryError,
  QueryErrorCode,
  QueryErrorDetailCode,
} from "libs/exception/application/query"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { EFriendRequestStatus } from "src/module/friends/domain/enum/friend-request-status.enum"
import { IFriendRepository } from "src/module/friends/domain/repository/friend.interface.repository"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { IsFriendQuery } from "./is-friend.query"

@QueryHandler(IsFriendQuery)
export class IsFriendHandler {
  constructor(
    private readonly friendRepository: IFriendRepository,
    private readonly userRepository: IUserRepository,
  ) {}
  async execute(query: IsFriendQuery) {
    const { userId, friendName } = query

    try {
      if (!userId || userId.length === 0) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: "User id can not be empty",
        })
      }
      if (!friendName || friendName.length === 0) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: "Friend name can not be empty",
        })
      }
      const [user, friend] = await Promise.all([
        this.userRepository.findById(userId),
        this.userRepository.findByUsername(friendName),
      ])
      if (userId === friend.id) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: "You can not get this information",
        })
      }

      if (!user) {
        throw new QueryError({
          code: QueryErrorCode.NOT_FOUND,
          message: "user not found",
          info: {
            errorCode: QueryErrorDetailCode.USER_NOT_FOUND,
          },
        })
      }
      if (!friend) {
        throw new QueryError({
          code: QueryErrorCode.NOT_FOUND,
          message: "friend not found",
          info: {
            errorCode: QueryErrorDetailCode.USER_NOT_FOUND,
          },
        })
      }
      const friendRequest = await this.friendRepository.getFriendRequest(
        user,
        friend,
      )
      if (!friendRequest || friendRequest === undefined) {
        return "No friend request"
      }
      if (friendRequest.status === EFriendRequestStatus.ACCEPTED) {
        return "Accepted"
      }
      if (friendRequest.status === EFriendRequestStatus.PENDING) {
        return "Pending"
      }
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
