import { CommandHandler } from "@nestjs/cqrs"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { LogoutFromOneDeviceCommand } from "./logout-from-one-device.command"

@CommandHandler(LogoutFromOneDeviceCommand)
export class LogoutFromOneDeviceCommandHandler {
  constructor(private readonly userRepository: IUserRepository) {}
  async execute(command: LogoutFromOneDeviceCommand) {
    const { userId, deviceId } = command

    try {
      if (!userId) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "User id can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.USER_NOT_FOUND,
          },
        })
      }
      if (!deviceId) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Device id can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.USER_NOT_FOUND,
          },
        })
      }
      const user = await this.userRepository.findById(userId)
      if (!user) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "User not found",
          info: {
            errorCode: CommandErrorDetailCode.USER_NOT_FOUND,
          },
        })
      }
      const device = await this.userRepository.getDevice(deviceId)
      if (!device) {
        throw new CommandError({
          code: CommandErrorCode.NOT_FOUND,
          message: "Device not found",
          info: {
            errorCode: CommandErrorDetailCode.USER_NOT_FOUND,
          },
        })
      }
      await this.userRepository.deleteTokenByDevice(deviceId)
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
