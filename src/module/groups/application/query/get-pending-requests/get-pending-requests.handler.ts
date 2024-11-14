import { QueryHandler } from "@nestjs/cqrs"
import {
  QueryError,
  QueryErrorCode,
  QueryErrorDetailCode,
} from "libs/exception/application/query"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { IFriendRepository } from "src/module/friends/domain/repository/friend.interface.repository"
import { EGroupPostStatus } from "src/module/groups/domain/enum/group-post-status.enum"
import { EGroupRole } from "src/module/groups/domain/enum/group-role.enum"
import { IGroupRepository } from "src/module/groups/domain/repository/group.interface.repository"
import { ImageService } from "src/module/image/application/image.service"
import { EImageType } from "src/module/image/domain/enum/image-type.enum"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { GetPendingRequestsQuery } from "./get-pending-requests.query"
import { GetPendingRequestsResult } from "./get-pending-requests.result"

@QueryHandler(GetPendingRequestsQuery)
export class GetPendingRequestsHandler {
  constructor(
    private readonly groupRepository: IGroupRepository,
    private readonly userRepository: IUserRepository,
    private readonly imageService: ImageService,
    private readonly friendRepository: IFriendRepository,
  ) {}
  async execute(
    query: GetPendingRequestsQuery,
  ): Promise<GetPendingRequestsResult> {
    const { userId, groupId, limit, offset, order, orderBy } = query
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
            errorCode: QueryErrorDetailCode.NOT_FOUND,
          },
        })
      }
      if (!groupId || groupId.length === 0) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: "Group id can not be empty",
          info: {
            errorCode: QueryErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
          },
        })
      }
      const group = await this.groupRepository.findGroupById(groupId)
      if (!group) {
        throw new QueryError({
          code: QueryErrorCode.NOT_FOUND,
          message: "Group not found",
          info: {
            errorCode: QueryErrorDetailCode.NOT_FOUND,
          },
        })
      }
      const member = await this.groupRepository.findMemberById(
        group.id,
        user.id,
      )
      if (!member) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: "You are not member of this group",
        })
      }
      if (group.ownerId !== user.id) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: "You do not have permission to do this action",
          info: {
            errorCode: QueryErrorDetailCode.UNAUTHORIZED,
          },
        })
      }
      // get pending requests
      const requests = await this.groupRepository.getGroupMemberRequest(group, {
        limit,
        offset,
        orderBy,
        order,
      })
      const pendingRequests = requests.filter(
        (e) => e.status === EGroupPostStatus.PENDING,
      )
      const result = await Promise.all(
        pendingRequests.map(async (e) => {
          // user info
          const requester = await this.userRepository.findById(e.userId)
          const requesterImage = await this.imageService.getImageByApplicableId(
            requester.id,
          )
          const requesterAvatar = requesterImage.find(
            (e) => e.imageType === EImageType.AVATAR,
          )
          const requesterInfo = {
            id: requester.id,
            username: requester?.name ?? "",
            avatar: requesterAvatar[0]?.url ?? "",
          }
          // friends
          const [friends, mutualFriends] = await Promise.all([
            this.friendRepository.getFriends(requester),
            this.friendRepository.getMutualFriends(user, requester),
          ])
          const numberOfFriends = friends.length
          const numberOfMutualFriends = mutualFriends.length
          const mutualFriendNames = await Promise.all(
            mutualFriends.map(async (e) => {
              const mutualFriend = await this.userRepository.findById(
                e.friendId,
              )
              return mutualFriend?.name ?? null
            }),
          )
          // get friend in group
          const friendIds = friends.map((e) => e.friendId)
          const groupMembers = await this.groupRepository.getGroupMembers(
            group,
            {},
          )
          const groupMemberIds = groupMembers.map((e) => e.memberId)
          const friendIdsInGroup = friendIds.filter((id) =>
            groupMemberIds.includes(id),
          )
          const friendsInGroup = friends.filter((f) =>
            friendIdsInGroup.includes(f.friendId),
          )
          const numberOfFriendsInGroup = friendsInGroup.length
          const friendNamesInGroup = await Promise.all(
            friendsInGroup.map(async (f) => {
              const friendInGroup = await this.userRepository.findById(
                f.friendId,
              )
              return friendInGroup?.name ?? null
            }),
          )
          // group in common
          const groupsInCommon =
            await this.groupRepository.getCommonGroupBetweenUsers(
              user.id,
              requester.id,
            )
          const numberOfGroupsInCommon = groupsInCommon.length
          const groupsInCommonName = groupsInCommon.map((e) => e.name)
          return {
            user: requesterInfo,
            numberOfFriends,
            numberOfMutualFriends,
            mutualFriendNames: mutualFriendNames.filter((e) => e !== null),
            numberOfFriendsInGroup,
            friendNamesInGroup: friendNamesInGroup.filter((e) => e !== null),
            numberOfGroupsInCommon,
            groupsInCommonName: groupsInCommonName.filter((e) => e !== null),
            createdAt: requester.createdAt.toISOString().split("T")[0],
          }
        }),
      )
      return { requests: result }
    } catch (error) {
      if (
        error instanceof DomainError ||
        error instanceof QueryError ||
        error instanceof InfrastructureError
      ) {
        throw error
      }

      throw new QueryError({
        code: QueryErrorCode.INTERNAL_SERVER_ERROR,
        message: "Internal Server Error",
      })
    }
  }
}
