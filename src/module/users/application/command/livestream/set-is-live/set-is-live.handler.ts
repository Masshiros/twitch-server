import { CommandHandler } from "@nestjs/cqrs"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { InfrastructureError } from "libs/exception/infrastructure"
import { UserAggregate } from "src/module/users/domain/aggregate"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { SetIsLiveCommand } from "./set-is-live.command"

@CommandHandler(SetIsLiveCommand)
export class SetIsLiveHandler {
  constructor(private readonly userRepository: IUserRepository) {}
  async execute(command: SetIsLiveCommand) {
    const { userId, isLive } = command
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
      if (!isLive) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Islive can not be empty",
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
      const livestreamInfo = await this.userRepository.getStreamInfoByUser(user)
      livestreamInfo.isLive = isLive
      await this.userRepository.updateLivestreamInfo(livestreamInfo)
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
