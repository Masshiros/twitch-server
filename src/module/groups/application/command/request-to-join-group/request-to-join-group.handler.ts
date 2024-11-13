import { CommandHandler } from "@nestjs/cqrs"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { EGroupRequestStatus } from "src/module/groups/domain/enum/group-request-status.enum"
import { GroupFactory } from "src/module/groups/domain/factory/groups.factory"
import { IGroupRepository } from "src/module/groups/domain/repository/group.interface.repository"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { RequestToJoinGroupCommand } from "./request-to-join-group.command"

@CommandHandler(RequestToJoinGroupCommand)
export class RequestToJoinGroupHandler {
  constructor(
    private readonly groupRepository: IGroupRepository,
    private readonly userRepository: IUserRepository,
  ) {}
  async execute(command: RequestToJoinGroupCommand) {
    const { userId, groupId } = command
    try {
      if (!userId || userId.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "User id can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
          },
        })
      }
      if (!groupId || groupId.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Group id can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
          },
        })
      }
      const group = await this.groupRepository.findGroupById(groupId)
      if (!group) {
        throw new CommandError({
          code: CommandErrorCode.NOT_FOUND,
          message: "Group not found",
          info: {
            errorCode: CommandErrorDetailCode.NOT_FOUND,
          },
        })
      }
      const user = await this.userRepository.findById(userId)
      if (!user) {
        throw new CommandError({
          code: CommandErrorCode.NOT_FOUND,
          message: "User not found",
          info: {
            errorCode: CommandErrorDetailCode.NOT_FOUND,
          },
        })
      }
      const member = await this.groupRepository.findMemberById(
        group.id,
        user.id,
      )
      if (member) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "You are already a member of this group",
        })
      }
      const request = GroupFactory.createMemberRequest({
        groupId: group.id,
        userId: user.id,
        status: EGroupRequestStatus.PENDING,
      })
      if (!request) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Cannot request to join now. Try again later",
          info: {
            errorCode: CommandErrorDetailCode.SOMETHING_WRONG_HAPPEN,
          },
        })
      }
      await this.groupRepository.addRequest(request)
    } catch (error) {
      if (
        error instanceof DomainError ||
        error instanceof CommandError ||
        error instanceof InfrastructureError
      ) {
        throw error
      }

      throw new CommandError({
        code: CommandErrorCode.INTERNAL_SERVER_ERROR,
        message: "Internal Server Error",
      })
    }
  }
}
