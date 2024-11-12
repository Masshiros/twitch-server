import { CommandHandler } from "@nestjs/cqrs"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { EInvitationStatus } from "src/module/groups/domain/enum/group-invitation-status.enum"
import { EGroupRole } from "src/module/groups/domain/enum/group-role.enum"
import { GroupFactory } from "src/module/groups/domain/factory/groups.factory"
import { IGroupRepository } from "src/module/groups/domain/repository/group.interface.repository"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { RejectInvitationCommand } from "./reject-invitation.command"

@CommandHandler(RejectInvitationCommand)
export class RejectInvitationHandler {
  constructor(
    private readonly groupRepository: IGroupRepository,
    private readonly userRepository: IUserRepository,
  ) {}
  async execute(command: RejectInvitationCommand) {
    const { groupId, userId } = command
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
      const invitation =
        await this.groupRepository.getLatestInvitationByUserAndGroup(
          userId,
          groupId,
        )
      if (!invitation) {
        throw new CommandError({
          code: CommandErrorCode.NOT_FOUND,
          message: "Invitation not found",
          info: { errorCode: CommandErrorDetailCode.NOT_FOUND },
        })
      }
      if (invitation.expiredAt && invitation.expiredAt < new Date()) {
        invitation.status = EInvitationStatus.EXPIRED
      }
      if (invitation.status === EInvitationStatus.PENDING) {
        invitation.status = EInvitationStatus.DECLINED

        await this.groupRepository.updateInvitation(invitation)
      } else if (invitation.status === EInvitationStatus.ACCEPTED) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: `You already accept the invitation`,
        })
      } else if (invitation.status === EInvitationStatus.DECLINED) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: `You already reject the invitation`,
        })
      } else if (invitation.status === EInvitationStatus.EXPIRED) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: `Your invitation has been expired`,
        })
      } else {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: `Invitation status is not valid for acceptance: ${invitation.status}`,
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
