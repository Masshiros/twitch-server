import { CommandHandler } from "@nestjs/cqrs"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { UserAggregate } from "src/users/domain/aggregate"
import { UserFactory } from "src/users/domain/factory/user"
import { IUserRepository } from "src/users/domain/repository/user"
import { UpdateUsernameCommand } from "./update-username.command"

@CommandHandler(UpdateUsernameCommand)
export class UpdateUsernameCommandHandler {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userFactory: UserFactory,
  ) {}
  async execute(
    command: UpdateUsernameCommand,
    currentUser: { id: string; username: string },
  ) {
    const { id: targetUserId, username } = command
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
    if (!username) {
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
    //TODO: validate last update username date
    const nextAllowedChangeDate = new Date(
      targetUserAggregate.lastUsernameChangeAt,
    )
    nextAllowedChangeDate.setDate(nextAllowedChangeDate.getDate() + 60)
    if (nextAllowedChangeDate > new Date()) {
      const daysLeft = Math.ceil(
        (nextAllowedChangeDate.getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24),
      )
      throw new CommandError({
        code: CommandErrorCode.BAD_REQUEST,
        message:
          "You can only change your username every 60 days. Try again in ${daysLeft} days",
        info: {
          errorCode: CommandErrorDetailCode.USERNAME_CHANGE_INTERVAL_NOT_MET,
        },
      })
    }

    if (!username) {
      targetUserAggregate.name = username
      targetUserAggregate.lastUsernameChangeAt = new Date()
    }
    await this.userRepository.updateUserProfile(targetUserAggregate)
  }
}
