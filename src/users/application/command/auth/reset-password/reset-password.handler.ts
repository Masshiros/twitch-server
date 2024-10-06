import { CommandHandler } from "@nestjs/cqrs"
import config from "libs/config"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { IUserRepository } from "src/users/domain/repository/user"
import { passwordRegex } from "utils/constants"
import { hashPassword } from "utils/encrypt"
import { ResetPasswordCommand } from "./reset-password.command"

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordCommandHandler {
  constructor(private readonly userRepository: IUserRepository) {}
  async execute(command: ResetPasswordCommand) {
    try {
      const { password, confirmPassword, token } = command

      if (!password) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Password can not be empty ",
          info: {
            errorCode: CommandErrorDetailCode.PASSWORD_CAN_NOT_BE_EMPTY,
          },
        })
      }
      // validate password regex
      if (!passwordRegex.test(password)) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message:
            "Invalid password, it must have at least 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character",
          info: {
            errorCode: CommandErrorDetailCode.INVALID_USER_PASSWORD,
          },
        })
      }
      if (!confirmPassword) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Confirm password can not be empty ",
          info: {
            errorCode: CommandErrorDetailCode.CONFIRM_PASSWORD_CAN_NOT_BE_EMPTY,
          },
        })
      }
      if (password !== confirmPassword) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Confirm password and password not match ",
          info: {
            errorCode:
              CommandErrorDetailCode.CONFIRM_PASSWORD_AND_PASSWORD_NOT_MATCH,
          },
        })
      }
      if (!token) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Forgot password token can not be empty ",
          info: {
            errorCode: CommandErrorDetailCode.INVALID_TOKEN,
          },
        })
      }

      const { sub } = await this.userRepository.decodeToken(token, {
        secret: config.JWT_SECRET_FORGOT_PASSWORD_TOKEN,
      })
      if (!sub) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Invalid token",
          info: {
            errorCode: CommandErrorDetailCode.INVALID_TOKEN,
          },
        })
      }
      const user = await this.userRepository.findById(sub)
      if (!user) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "User not found",
          info: {
            errorCode: CommandErrorDetailCode.USER_NOT_FOUND,
          },
        })
      }
      // update user
      user.forgotPasswordToken = ""
      user.password = await hashPassword(password)
      await this.userRepository.update(user)
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
