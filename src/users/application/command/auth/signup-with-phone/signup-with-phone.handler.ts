import { CommandHandler, type ICommandHandler } from "@nestjs/cqrs"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { UserAggregate } from "src/users/domain/aggregate"
import { UserFactory } from "src/users/domain/factory/user"
import { IUserRepository } from "src/users/domain/repository/user"
import { mailRegex, passwordRegex, phoneRegex } from "utils/constants"
import { hashPassword } from "utils/encrypt"
import { SignupWithPhoneCommand } from "./signup-with-phone.command"

@CommandHandler(SignupWithPhoneCommand)
export class SignupWithPhoneCommandHandler
  implements ICommandHandler<SignupWithPhoneCommand>
{
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userFactory: UserFactory,
  ) {}
  async execute(command: SignupWithPhoneCommand): Promise<void> {
    const { phone, password, name, dob } = command
    try {
      // validate phone length
      if (phone.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Phone can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.PHONE_CAN_NOT_BE_EMPTY,
          },
        })
      }
      // validate phone exist
      if (await this.userRepository.isPhoneExisted(phone)) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Phone already exists",
          info: {
            errorCode: CommandErrorDetailCode.PHONE_ALREADY_EXIST,
          },
        })
      }
      // validate password length
      if (password.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Password can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.PASSWORD_CAN_NOT_BE_EMPTY,
          },
        })
      }
      // validate phone regex
      if (!phoneRegex.test(phone)) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message:
            "Invalid phone number. Please enter a valid phone number in the format: +123 (456) 789-0123 or 123-456-7890.",
          info: {
            errorCode: CommandErrorDetailCode.INVALID_USER_PHONE,
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
      const user: UserAggregate = this.userFactory.createAggregate({})
      user.phoneNumber = phone
      user.password = await hashPassword(password)
      user.name = name
      user.dob = dob
      await this.userRepository.createUser(user)
    } catch (err) {
      console.error(err.stack)
      if (
        err instanceof DomainError ||
        err instanceof CommandError ||
        err instanceof InfrastructureError
      ) {
        throw err
      }

      throw new CommandError({
        code: CommandErrorCode.INTERNAL_SERVER_ERROR,
        message: "Internal Server Error",
      })
    }
  }
}
