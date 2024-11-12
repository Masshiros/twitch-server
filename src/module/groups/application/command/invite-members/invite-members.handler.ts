import { CommandHandler } from "@nestjs/cqrs"
import { EGroupRole } from "@prisma/client"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { GroupFactory } from "src/module/groups/domain/factory/groups.factory"
import { IGroupRepository } from "src/module/groups/domain/repository/group.interface.repository"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { InviteMembersCommand } from "./invite-members.command"

@CommandHandler(InviteMembersCommand)
export class InviteMembersHandler {
  constructor(
    private readonly groupRepository: IGroupRepository,
    private readonly userRepository: IUserRepository,
  ) {}
  async execute(command: InviteMembersCommand) {
    const { groupId, userId, friendIds } = command
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
      if (!friendIds || friendIds.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "List friend ids can not be empty",
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
      if (!member) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "You are not member of this group",
          info: {
            errorCode: CommandErrorDetailCode.UNAUTHORIZED,
          },
        })
      }
      // if (member.role !== EGroupRole.ADMIN) {
      //   throw new CommandError({
      //     code: CommandErrorCode.BAD_REQUEST,
      //     message: "You do not have permission to do this action",
      //     info: {
      //       errorCode: CommandErrorDetailCode.UNAUTHORIZED,
      //     },
      //   })
      // }
      const invitations = await Promise.all(
        friendIds.map(async (f) => {
          const friend = await this.userRepository.findById(f)
          if (!friend) {
            throw new CommandError({
              code: CommandErrorCode.NOT_FOUND,
              message: "Friend not found",
              info: {
                errorCode: CommandErrorDetailCode.NOT_FOUND,
              },
            })
          }
          const invitation = GroupFactory.createGroupInvitation({
            groupId: group.id,
            invitedUserId: friend.id,
            inviterId: userId,
          })
          return invitation
        }),
      )
      await Promise.all(
        invitations.map((e) => {
          this.groupRepository.addInvitation(e)
        }),
      )
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
