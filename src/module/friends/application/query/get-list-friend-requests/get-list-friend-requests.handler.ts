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
import { GetListFriendRequestQuery } from "./get-list-friend-requests.query"
import { GetListFriendRequestsResult } from "./get-list-friend-requests.result"

@QueryHandler(GetListFriendRequestQuery)
export class GetListFriendRequestHandler {
  constructor(
    private readonly friendRepository: IFriendRepository,
    private readonly userRepository: IUserRepository,
    private readonly imageService: ImageService,
  ) {}
  async execute(
    query: GetListFriendRequestQuery,
  ): Promise<GetListFriendRequestsResult> {
    const { receiverId } = query
    try {
      if (!receiverId || receiverId.length === 0) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: " Data from client can not be empty",
          info: {
            errorCode: QueryErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
            field: "receiverId",
          },
        })
      }
      const receiver = await this.userRepository.findById(receiverId)
      if (!receiver) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: "Receiver not found",
          info: {
            errorCode: QueryErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
          },
        })
      }
      const friendRequests =
        await this.friendRepository.getListFriendRequest(receiver)

      //   console.log(friendRequests)
      const result = await Promise.all(
        friendRequests.map(async (e) => {
          const sender = await this.userRepository.findById(e.senderId)
          if (!sender) {
            return null
          }
          const avatar = await this.imageService.getImageByApplicableId(
            sender.id,
          )
          return {
            sender: {
              senderId: sender.id,
              username: sender.name,
              avatar: avatar[0]?.url ?? "",
            },
            sentAt: e.createdAt.toISOString().split("T")[0],
          }
        }),
      )
      return { friendRequests: result.filter((e) => e !== null) }
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
