import { CommandHandler } from "@nestjs/cqrs"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { EGroupPostStatus } from "src/module/groups/domain/enum/group-post-status.enum"
import { EGroupRole } from "src/module/groups/domain/enum/group-role.enum"
import { IGroupRepository } from "src/module/groups/domain/repository/group.interface.repository"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { ApproveGroupPostCommand } from "./approve-group-post.command"

@CommandHandler(ApproveGroupPostCommand)
export class ApproveGroupPostHandler {
  constructor(
    private readonly groupRepository: IGroupRepository,
    private readonly userRepository: IUserRepository,
  ) {}
  async execute(command: ApproveGroupPostCommand) {
    const { userId, groupId, groupPostId } = command
    try {
      if (!userId || userId.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "User id can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
            field: "userId",
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
      if (!groupPostId || groupPostId.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Group post id can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
            field: "groupPostId",
          },
        })
      }

      const user = await this.userRepository.findById(userId)
      if (!user) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "User not found",
          info: {
            errorCode: CommandErrorDetailCode.USER_NOT_FOUND,
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
      const groupPost = await this.groupRepository.findPostById(groupPostId)
      if (!groupPost) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Group post not found",
          info: {
            errorCode: CommandErrorDetailCode.USER_NOT_FOUND,
          },
        })
      }
      const member = await this.groupRepository.findMemberById(
        group.id,
        user.id,
      )
      if (!member) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "You are not member of this group",
          info: {
            errorCode: CommandErrorDetailCode.UNAUTHORIZED,
          },
        })
      }
      if (group.ownerId !== user.id) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "You do not have permission to do this action",
          info: {
            errorCode: CommandErrorDetailCode.UNAUTHORIZED,
          },
        })
      }
      groupPost.status = EGroupPostStatus.APPROVED
      await this.groupRepository.updatePost(groupPost)
    } catch (err) {
      if (
        err instanceof DomainError ||
        err instanceof CommandError ||
        err instanceof InfrastructureError
      ) {
        throw err
      }

      throw new CommandError({
        code: CommandErrorCode.INTERNAL_SERVER_ERROR,
        message: err.message,
      })
    }
  }
}
