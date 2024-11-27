import { CommandHandler } from "@nestjs/cqrs"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { InfrastructureError } from "libs/exception/infrastructure"
import { UserAggregate } from "src/module/users/domain/aggregate"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { SetViewCommand } from "./set-view.command"

@CommandHandler(SetViewCommand)
export class SetViewHandler {
  constructor(private readonly userRepository: IUserRepository) {}
  async execute(command: SetViewCommand) {
    const { userId, view } = command
    try {
      if (!userId && userId.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "User id can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.UPDATE_USER_ID_CAN_NOT_BE_EMPTY,
          },
        })
      }
      if (!view) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "view can not be empty",
        })
      }
      const user: UserAggregate | null =
        await this.userRepository.findById(userId)
      if (!user) {
        throw new CommandError({
          code: CommandErrorCode.NOT_FOUND,
          message: "User not found",
          info: {
            errorCode: CommandErrorDetailCode.USER_NOT_FOUND,
          },
        })
      }
      const liveStream =
        await this.userRepository.getCurrentLivestreamSession(user)
      if (!liveStream) {
        throw new CommandError({
          code: CommandErrorCode.NOT_FOUND,
          message: "Livestream not found",
          info: {
            errorCode: CommandErrorDetailCode.USER_NOT_FOUND,
          },
        })
      }
      liveStream.totalView = view
      await this.userRepository.updateLivestream(liveStream)
    } catch (err) {
      if (err instanceof CommandError || err instanceof InfrastructureError) {
        throw err
      }

      throw new CommandError({
        code: CommandErrorCode.INTERNAL_SERVER_ERROR,
        message: err.message,
      })
    }
  }
}
