import { CommandHandler } from "@nestjs/cqrs"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { EGroupRequestStatus } from "src/module/groups/domain/enum/group-request-status.enum"
import { EGroupRole } from "src/module/groups/domain/enum/group-role.enum"
import { GroupFactory } from "src/module/groups/domain/factory/groups.factory"
import { IGroupRepository } from "src/module/groups/domain/repository/group.interface.repository"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { RejectRequestCommand } from "./reject-request.command"

@CommandHandler(RejectRequestCommand)
export class RejectRequestHandler {
  constructor(
    private readonly groupRepository: IGroupRepository,
    private readonly userRepository: IUserRepository,
  ) {}
  async execute(command: RejectRequestCommand) {
    const { userId, requestUserId, groupId } = command
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
      if (!requestUserId || requestUserId.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Request user id can not be empty",
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
      const [user, requestUser] = await Promise.all([
        this.userRepository.findById(userId),
        this.userRepository.findById(requestUserId),
      ])
      if (!user) {
        throw new CommandError({
          code: CommandErrorCode.NOT_FOUND,
          message: "User not found",
          info: {
            errorCode: CommandErrorDetailCode.NOT_FOUND,
          },
        })
      }
      if (!requestUser) {
        throw new CommandError({
          code: CommandErrorCode.NOT_FOUND,
          message: "Request user not found",
          info: {
            errorCode: CommandErrorDetailCode.NOT_FOUND,
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
      const request = await this.groupRepository.getLatestMemberRequest(
        group,
        requestUserId,
      )
      if (!request) {
        throw new CommandError({
          code: CommandErrorCode.NOT_FOUND,
          message: "You have not request to join this group",
          info: {
            errorCode: CommandErrorDetailCode.NOT_FOUND,
          },
        })
      }
      if (request.status === EGroupRequestStatus.PENDING) {
        request.status = EGroupRequestStatus.DECLINED
        await this.groupRepository.updateRequest(request)
      } else if (request.status === EGroupRequestStatus.APPROVED) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "You already approved to this request",
        })
      } else if (request.status === EGroupRequestStatus.DECLINED) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "You already declined to this request",
        })
      }
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
