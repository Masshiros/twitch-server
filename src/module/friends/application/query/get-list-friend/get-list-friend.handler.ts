import { QueryHandler } from "@nestjs/cqrs"
import {
  QueryError,
  QueryErrorCode,
  QueryErrorDetailCode,
} from "libs/exception/application/query"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { Friend } from "src/module/friends/domain/entity/friend.entity"
import { IFriendRepository } from "src/module/friends/domain/repository/friend.interface.repository"
import { ImageService } from "src/module/image/application/image.service"
import { Image } from "src/module/image/domain/entity/image.entity"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { GetListFriendQuery } from "./get-list-friend.query"
import { GetListFriendResult } from "./get-list-friend.result"

@QueryHandler(GetListFriendQuery)
export class GetListFriendHandler {
  constructor(
    private readonly friendRepository: IFriendRepository,
    private readonly userRepository: IUserRepository,
    private readonly imageService: ImageService,
  ) {}
  async execute(query: GetListFriendQuery): Promise<GetListFriendResult> {
    const { userId, currentUserId } = query
    try {
      if (!userId || userId.length === 0) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: " Data from client can not be empty",
          info: {
            errorCode: QueryErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
            field: "userId",
          },
        })
      }
      const user = await this.userRepository.findById(userId)
      if (!user) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: "User not found",
          info: {
            errorCode: QueryErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
          },
        })
      }
      if (!currentUserId || currentUserId.length === 0) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: " Data from client can not be empty",
          info: {
            errorCode: QueryErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
            field: "currentUserId",
          },
        })
      }
      const currentUser = await this.userRepository.findById(currentUserId)
      if (!currentUser) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: "currentUser not found",
          info: {
            errorCode: QueryErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
          },
        })
      }
      const friends = await this.friendRepository.getFriends(user)
      const result = await Promise.all(
        friends.map(async (e) => {
          const friend = await this.userRepository.findById(e.friendId)
          if (!friend) {
            return null
          }
          let avatar: Image[]
          let mutualFriends: Friend[]
          let isFriend: boolean
          if (userId !== currentUserId) {
            ;[avatar, mutualFriends, isFriend] = await Promise.all([
              this.imageService.getImageByApplicableId(friend.id),
              this.friendRepository.getMutualFriends(currentUser, friend),
              this.friendRepository.isFriend(currentUser, friend),
            ])
          } else {
            ;[avatar, mutualFriends, isFriend] = await Promise.all([
              this.imageService.getImageByApplicableId(friend.id),
              this.friendRepository.getMutualFriends(user, friend),
              this.friendRepository.isFriend(user, friend),
            ])
          }

          return {
            userId: friend.id,
            username: friend.name,
            avatar: avatar[0]?.url ?? "",
            isFriend: isFriend,
            numberOfMutualFriends: mutualFriends.length,
          }
        }),
      )
      return { friends: result.filter((e) => e !== null) }
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
