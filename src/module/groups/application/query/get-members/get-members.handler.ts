import { QueryHandler } from "@nestjs/cqrs"
import { EImage } from "@prisma/client"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import {
  QueryError,
  QueryErrorCode,
  QueryErrorDetailCode,
} from "libs/exception/application/query"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { IFriendRepository } from "src/module/friends/domain/repository/friend.interface.repository"
import { EGroupRole } from "src/module/groups/domain/enum/group-role.enum"
import { IGroupRepository } from "src/module/groups/domain/repository/group.interface.repository"
import { ImageService } from "src/module/image/application/image.service"
import { EImageType } from "src/module/image/domain/enum/image-type.enum"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { GetMembersQuery } from "./get-members.query"
import { GetMembersResult } from "./get-members.result"

@QueryHandler(GetMembersQuery)
export class GetMembersHandler {
  constructor(
    private readonly groupRepository: IGroupRepository,
    private readonly userRepository: IUserRepository,
    private readonly imageService: ImageService,
    private readonly friendRepository: IFriendRepository,
  ) {}
  async execute(query: GetMembersQuery): Promise<GetMembersResult> {
    const { userId, groupId } = query
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
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Group id can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
            field: "groupId",
          },
        })
      }
      const group = await this.groupRepository.findGroupById(groupId)
      if (!group) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Group not found",
          info: {
            errorCode: CommandErrorDetailCode.USER_NOT_FOUND,
          },
        })
      }
      // get friends
      const friendOfUsers = await this.friendRepository.getFriends(user)
      const friendIds = friendOfUsers.map((e) => e.friendId)
      const groupMembers = await this.groupRepository.getGroupMembers(group, {})
      const groupMemberIds = groupMembers.map((e) => e.memberId)
      const friendIdsInGroup = friendIds.filter((id) =>
        groupMemberIds.includes(id),
      )
      const friendsInGroup = friendOfUsers.filter((f) =>
        friendIdsInGroup.includes(f.friendId),
      )
      const numberOfFriendsInGroup = friendsInGroup.length
      const friends = await Promise.all(
        friendsInGroup.map(async (f) => {
          const friendInGroup = await this.userRepository.findById(f.friendId)
          if (!friendInGroup) {
            return null
          }
          const friendImages = await this.imageService.getImageByApplicableId(
            friendInGroup.id,
          )
          const friendAvatar = friendImages.find(
            (e) => e.imageType === EImageType.AVATAR,
          )
          return {
            id: friendInGroup.id,
            username: friendInGroup.name,
            avatar: friendAvatar?.url ?? "",
          }
        }),
      )
    //   console.log(groupMembers)
      const adminInGroups = groupMembers.filter(
        (e) => e.role === EGroupRole.ADMIN,
      )
    //   console.log(adminInGroups)
      const admins = await Promise.all(
        adminInGroups.map(async (e) => {
          const admin = await this.userRepository.findById(e.memberId)
          if (!admin) {
            return null
          }
          const adminImages = await this.imageService.getImageByApplicableId(
            admin.id,
          )
          const adminAvatar = adminImages.find(
            (e) => e.imageType === EImageType.AVATAR,
          )
          return {
            id: admin.id,
            username: admin.name,
            avatar: adminAvatar?.url ?? "",
          }
        }),
      )
      const numberOfAdminsInGroup = admins.length
      return {
        numberOfAdminsInGroup,
        admins: admins.filter((e) => e !== null),
        numberOfFriendsInGroup,
        friends: friends.filter((e) => e !== null),
      }
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
