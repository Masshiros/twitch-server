import { CommandHandler, type ICommandHandler } from "@nestjs/cqrs"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "../../../../../../libs/exception/application/command"
import { DomainError } from "../../../../../../libs/exception/domain/index"
import { InfrastructureError } from "../../../../../../libs/exception/infrastructure/index"
import { mailRegex, passwordRegex } from "../../../../../../utils/constants"
import { hashPassword } from "../../../../../../utils/encrypt"
import { type UserAggregate } from "../../../../domain/aggregate"
import { UserFactory } from "../../../../domain/factory/user"
import { IUserRepository } from "../../../../domain/repository/user/index"
import { SignupWithEmailCommand } from "./signup-with-email.command"

@CommandHandler(SignupWithEmailCommand)
export class SignupWithEmailCommandHandler
  implements ICommandHandler<SignupWithEmailCommand>
{
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userFactory: UserFactory,
  ) {}
  async execute(command: SignupWithEmailCommand): Promise<void> {
    const { email, password, name, dob } = command
    try {
      // validate email length
      if (email.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Email can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.EMAIL_CAN_NOT_BE_EMPTY,
          },
        })
      }
      // validate email exist
      if (!(await this.userRepository.isEmailExisted(email))) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Email already exists",
          info: {
            errorCode: CommandErrorDetailCode.EMAIL_ALREADY_EXIST,
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
      // validate email regex
      if (!mailRegex.test(email)) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Invalid email, email must be in format xxx@yyyy.zzz",
          info: {
            errorCode: CommandErrorDetailCode.INVALID_USER_EMAIL,
          },
        })
      }
      // validate password regex
      if (!passwordRegex.test(password)) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message:
            "Invalid password, it must have at least 8 characters, at least one character and one number",
          info: {
            errorCode: CommandErrorDetailCode.INVALID_USER_PASSWORD,
          },
        })
      }

      const user: UserAggregate = this.userFactory.createAggregate({})
      user.email = email
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
