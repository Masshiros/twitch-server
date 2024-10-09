import { CommandHandler } from "@nestjs/cqrs"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { UserAggregate } from "src/module/users/domain/aggregate"
import { UserFactory } from "src/module/users/domain/factory/user"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { UpdateBioCommand } from "./update-bio.command"

@CommandHandler(UpdateBioCommand)
export class UpdateBioCommandHandler {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userFactory: UserFactory,
  ) {}
  async execute(
    command: UpdateBioCommand,
    currentUser: { id: string; username: string },
  ): Promise<void> {
    const { id: targetUserId, displayName, bio } = command
    // validate user id
    if (targetUserId.length === 0) {
      throw new CommandError({
        code: CommandErrorCode.BAD_REQUEST,
        message: "Update user id can not be empty",
        info: {
          errorCode: CommandErrorDetailCode.UPDATE_USER_ID_CAN_NOT_BE_EMPTY,
        },
      })
    }
    // validate data's update
    if (!displayName && !bio) {
      throw new CommandError({
        code: CommandErrorCode.BAD_REQUEST,
        message: "Can not update user without data",
        info: {
          errorCode: CommandErrorDetailCode.CAN_NOT_UPDATE_USER_WITHOUT_DATA,
        },
      })
    }
    // validate current user's id equal target user's id
    if (targetUserId !== currentUser.id) {
      throw new CommandError({
        code: CommandErrorCode.BAD_REQUEST,
        message: "Unauthorized to update user",
        info: {
          errorCode: CommandErrorDetailCode.UNAUTHORIZED,
        },
      })
    }
    // validate target user exist
    const targetUserAggregate: UserAggregate | null =
      await this.userRepository.findById(targetUserId)

    if (!targetUserAggregate) {
      throw new CommandError({
        code: CommandErrorCode.NOT_FOUND,
        message: "User not found",
        info: {
          errorCode: CommandErrorDetailCode.USER_NOT_FOUND,
        },
      })
    }
    // validate current user exist
    const currentUserAggregate: UserAggregate | null =
      await this.userRepository.findByUsername(currentUser.username)

    if (!currentUserAggregate || currentUserAggregate.id !== currentUser.id) {
      throw new CommandError({
        code: CommandErrorCode.BAD_REQUEST,
        message: "Unauthorized",
        info: {
          errorCode: CommandErrorDetailCode.UNAUTHORIZED,
        },
      })
    }
    if (!displayName || displayName === "") {
      targetUserAggregate.displayName = displayName
    }
    if (!bio || bio === "") {
      targetUserAggregate.bio = bio
    }
    await this.userRepository.update(targetUserAggregate)
    try {
    } catch (error) {
      console.error(error.stack)
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
