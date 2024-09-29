import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { JwtService } from "@nestjs/jwt"
import { tokenType } from "libs/constants/enum"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { TokenPayload } from "src/common/interface"
import { UserAggregate } from "src/users/domain/aggregate"
import { UserFactory } from "src/users/domain/factory/user"
import { IUserRepository } from "src/users/domain/repository/user"
import { comparePassword } from "utils/encrypt"
import { SignInCommand } from "./signin.command"
import { SignInCommandResult } from "./signin.result"

@CommandHandler(SignInCommand)
export class SignInCommandHandler implements ICommandHandler<SignInCommand> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userFactory: UserFactory,
  ) {}
  async execute(command: SignInCommand): Promise<SignInCommandResult | null> {
    const { username, password } = command
    try {
      // validate data of body
      if (username.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "User name can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.USERNAME_CAN_NOT_BE_EMPTY,
          },
        })
      }
      if (password.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Password can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.PASSWORD_CAN_NOT_BE_EMPTY,
          },
        })
      }
      const userAggregate: UserAggregate | null =
        await this.userRepository.findByUsername(username)
      // validate user exist
      if (!userAggregate) {
        throw new CommandError({
          code: CommandErrorCode.NOT_FOUND,
          message: "User not found",
          info: {
            errorCode: CommandErrorDetailCode.USER_NOT_FOUND,
          },
        })
      }
      // validate password match
      if (!comparePassword(password, userAggregate.password)) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Password is wrong",
          info: {
            errorCode: CommandErrorDetailCode.PASSWORD_IS_WRONG,
          },
        })
      }
      // jwt
      const accessTokenPayload: TokenPayload = {
        sub: userAggregate.id,
        email: userAggregate.email,
        username: userAggregate.name,
        tokenType: tokenType.AccessToken,
        // TODO(device): handle device id later
        deviceId: "device-id",
        // add others later
        // TODO(role): Add role
      }
      const refreshTokenPayload: TokenPayload = {
        sub: userAggregate.id,
        email: userAggregate.email,
        username: userAggregate.name,
        // TODO(device): handle device id later
        deviceId: "device-id",
        tokenType: tokenType.RefreshToken,
        // add others later
        // TODO(role): Add role
      }
      const [accessToken, refreshToken] = await Promise.all([
        this.userRepository.generateToken(accessTokenPayload),
        this.userRepository.generateToken(refreshTokenPayload),
      ])
      // store refreshToken
      await this.userRepository.storeToken(refreshToken)

      return { accessToken, refreshToken }
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
