import { CommandHandler } from "@nestjs/cqrs"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { EGroupRole } from "src/module/groups/domain/enum/group-role.enum"
import { IGroupRepository } from "src/module/groups/domain/repository/group.interface.repository"
import { ImageService } from "src/module/image/application/image.service"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { AddDescriptionCommand } from "./add-description.command"

@CommandHandler(AddDescriptionCommand)
export class AddDescriptionHandler {
  constructor(
    private readonly groupRepository: IGroupRepository,
    private readonly imageService: ImageService,
    private readonly userRepository: IUserRepository,
  ) {}
  async execute(command: AddDescriptionCommand) {
    const { groupId, userId, description } = command
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
      if (!description || description.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Description can not be empty",
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
      if (member.role !== EGroupRole.ADMIN) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "You do not have permission to do this action",
          info: {
            errorCode: CommandErrorDetailCode.UNAUTHORIZED,
          },
        })
      }
      group.description = description
      group.updatedAt = new Date()
      await this.groupRepository.updateGroup(group)
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
