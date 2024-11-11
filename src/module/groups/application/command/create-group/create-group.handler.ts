import { CommandHandler } from "@nestjs/cqrs"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { GroupFactory } from "src/module/groups/domain/factory/groups.factory"
import { IGroupRepository } from "src/module/groups/domain/repository/group.interface.repository"
import { ImageService } from "src/module/image/application/image.service"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { CreateGroupCommand } from "./create-group.command"

@CommandHandler(CreateGroupCommand)
export class CreateGroupHandler {
  constructor(
    private readonly groupRepository: IGroupRepository,
    private readonly userRepository: IUserRepository,
    private readonly imageService: ImageService,
  ) {}
  async execute(command: CreateGroupCommand) {
    const { name, privacy, visibility, friendIds, ownerId } = command
    try {
      if (!name || name.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Group name can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
            field: "name",
          },
        })
      }
      if (!visibility) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Group visibility can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
            field: "visibility",
          },
        })
      }
      if (!ownerId) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "OwnerId can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
            field: "ownerId",
          },
        })
      }
      const owner = await this.userRepository.findById(ownerId)
      if (!owner) {
        throw new CommandError({
          code: CommandErrorCode.NOT_FOUND,
          message: "Owner not found",
          info: {
            errorCode: CommandErrorDetailCode.USER_NOT_FOUND,
          },
        })
      }
      const group = GroupFactory.createGroup({
        name,
        visibility,
        ownerId,
      })
      if (!group) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Cannot create group",
          info: {
            errorCode: CommandErrorDetailCode.SOMETHING_WRONG_HAPPEN,
          },
        })
      }
      await this.groupRepository.addGroup(group)
      if (friendIds) {
        await Promise.all(
          friendIds.map(async (f) => {
            const friend = await this.userRepository.findById(f)
          }),
        )
      }
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
