import { CommandHandler } from "@nestjs/cqrs"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { InfrastructureError } from "libs/exception/infrastructure"
import { UserAggregate } from "src/module/users/domain/aggregate"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { SetStreamKeyCommand } from "./set-stream-key.command"

@CommandHandler(SetStreamKeyCommand)
export class SetStreamKeyHandler {
  constructor(private readonly userRepository: IUserRepository) {}
  async execute(command: SetStreamKeyCommand) {
    const { userId, streamKey, serverUrl } = command
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
      if (!streamKey && streamKey.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Stream key can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
          },
        })
      }
      if (!serverUrl && serverUrl.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Server url can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
          },
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
      if (streamKey) {
        user.streamKey = streamKey
      }
      if (serverUrl) {
        user.serverUrl = serverUrl
      }
      await this.userRepository.update(user)
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
