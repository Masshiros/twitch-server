import { CommandHandler } from "@nestjs/cqrs"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { UserAggregate } from "src/module/users/domain/aggregate"
import { UserFactory } from "src/module/users/domain/factory/user"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { EmailTemplate } from "src/module/users/domain/value-object/email-template.vo"
import { hashToken } from "utils/encrypt"
import { ToggleTwoFaCommand } from "./toggle-two-fa.command"

@CommandHandler(ToggleTwoFaCommand)
export class ToggleTwoFaCommandHandler {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userFactory: UserFactory,
  ) {}
  async execute(
    command: ToggleTwoFaCommand,
    // currentUser: { id: string; username: string },
  ) {
    const { id: targetUserId } = command
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
    // validate current user's id equal target user's id
    // if (targetUserId !== currentUser.id) {
    //   throw new CommandError({
    //     code: CommandErrorCode.BAD_REQUEST,
    //     message: "Unauthorized to update user",
    //     info: {
    //       errorCode: CommandErrorDetailCode.UNAUTHORIZED,
    //     },
    //   })
    // }
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
    // const currentUserAggregate: UserAggregate | null =
    //   await this.userRepository.findByUsername(currentUser.username)

    // if (!currentUserAggregate || currentUserAggregate.id !== currentUser.id) {
    //   throw new CommandError({
    //     code: CommandErrorCode.BAD_REQUEST,
    //     message: "Unauthorized",
    //     info: {
    //       errorCode: CommandErrorDetailCode.UNAUTHORIZED,
    //     },
    //   })
    // }
    targetUserAggregate.is2FA = !targetUserAggregate.is2FA
    await this.userRepository.update(targetUserAggregate)
  }
}
