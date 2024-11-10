import { QueryHandler } from "@nestjs/cqrs"
import {
  QueryError,
  QueryErrorCode,
  QueryErrorDetailCode,
} from "libs/exception/application/query"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { IFriendRepository } from "src/module/friends/domain/repository/friend.interface.repository"
import { ImageService } from "src/module/image/application/image.service"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { GetMutualFriendsQuery } from "./get-mutual-friends.query"

@QueryHandler(GetMutualFriendsQuery)
export class GetMutualFriendsHandler {
  constructor(
    private readonly friendRepository: IFriendRepository,
    private readonly userRepository: IUserRepository,
    private readonly imageService: ImageService,
  ) {}
  async execute(query: GetMutualFriendsQuery) {
    const { userId, currentUserId } = query
    try {
      if (!userId || userId.length === 0) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: "User to get mutual friends' id can not be empty",
          info: {
            errorCode: QueryErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
            field: "userId",
          },
        })
      }
      const user = await this.userRepository.findById(userId)
      if (!user) {
        throw new QueryError({
          code: QueryErrorCode.NOT_FOUND,
          message: "User not found",
          info: {
            errorCode: QueryErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
          },
        })
      }
      if (!currentUserId || currentUserId.length === 0) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: "Current user id can not be empty",
          info: {
            errorCode: QueryErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
            field: "currentUserId",
          },
        })
      }
      const currentUser = await this.userRepository.findById(currentUserId)
      if (!currentUser) {
        throw new QueryError({
          code: QueryErrorCode.NOT_FOUND,
          message: "currentUser not found",
          info: {
            errorCode: QueryErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
          },
        })
      }
      const mutualFriends = await this.friendRepository.getMutualFriends(
        currentUser,
        user,
      )
      const result = await Promise.all(
        mutualFriends.map(async (e) => {
          const friend = await this.userRepository.findById(e.friendId)
          if (!friend) {
            return null
          }
          const [avatar, mutualFriends, isFriend] = await Promise.all([
            this.imageService.getImageByApplicableId(friend.id),
            this.friendRepository.getMutualFriends(currentUser, friend),
            this.friendRepository.isFriend(currentUser, friend),
          ])
          return {
            userId: friend.id,
            username: friend.name,
            avatar: avatar[0]?.url ?? "",
            isFriend: isFriend,
            numberOfMutualFriends: mutualFriends.length,
          }
        }),
      )
      return { mutualFriends: result.filter((e) => e !== null) }
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
