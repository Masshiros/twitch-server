import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { JwtService } from "@nestjs/jwt"
import config from "libs/config"
import { tokenType } from "libs/constants/enum"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { TokenPayload } from "src/common/interface"
import { UserAggregate } from "src/module/users/domain/aggregate"
import { Device } from "src/module/users/domain/entity/devices.entity"
import { LoginHistory } from "src/module/users/domain/entity/login-histories.entity"
import { UserFactory } from "src/module/users/domain/factory/user"
import { IUserRepository } from "src/module/users/domain/repository/user"
import { comparePassword, generateDeviceId } from "utils/encrypt"
import { v4 as uuidv4 } from "uuid"
import { SignInCommand } from "./signin.command"
import { SignInCommandResult } from "./signin.result"

@CommandHandler(SignInCommand)
export class SignInCommandHandler implements ICommandHandler<SignInCommand> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userFactory: UserFactory,
  ) {}
  async execute(command: SignInCommand): Promise<SignInCommandResult | null> {
    const {
      username,
      password,
      ipAddress,
      userAgent,
      deviceType,

      deviceName,
    } = command
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
      if (!userAggregate.isActive) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Your account has been deactivated. Reactivate your account",
          info: {
            errorCode: CommandErrorDetailCode.INACTIVATE_ACCOUNT,
          },
        })
      }
      // validate user email verify
      if (userAggregate.emailVerifyToken !== "") {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message:
            "Your account has not been verified. Please check your gmail to verify your account",
          info: {
            errorCode: CommandErrorDetailCode.EMAIL_IS_NOT_VERIFIED,
          },
        })
      }
      // new device

      // generate device Id
      const deviceId = generateDeviceId(userAggregate.id, userAgent)
      const device = new Device(
        {
          userId: userAggregate.id,
          type: deviceType,
          ipAddress: ipAddress,
          name: deviceName,
          userAgent: userAgent,
          lastUsed: new Date(),
        },
        deviceId,
      )

      // jwt
      const accessTokenPayload: TokenPayload = {
        sub: userAggregate.id,
        email: userAggregate.email,
        username: userAggregate.name,
        tokenType: tokenType.AccessToken,

        // add others later
        // TODO(role): Add role
      }
      const refreshTokenPayload: TokenPayload = {
        sub: userAggregate.id,
        email: userAggregate.email,
        username: userAggregate.name,
        tokenType: tokenType.RefreshToken,
        deviceId: device.id,
        // add others later
        // TODO(role): Add role
      }

      const [accessToken, refreshToken] = await Promise.all([
        this.userRepository.generateToken(accessTokenPayload, {
          secret: config.JWT_SECRET_ACCESS_TOKEN,
          expiresIn: config.ACCESS_TOKEN_EXPIRES_IN,
        }),
        this.userRepository.generateToken(refreshTokenPayload, {
          secret: config.JWT_SECRET_REFRESH_TOKEN,
          expiresIn: config.REFRESH_TOKEN_EXPIRES_IN,
        }),
        this.userRepository.createOrUpdateDevice(device),
      ])
      if (accessToken) {
        // new login history
        const loginHistory = new LoginHistory(
          {
            userId: userAggregate.id,
            deviceId: device.id,
            loginAt: new Date(),
            loginStatus: true,
          },
          uuidv4(),
        )
        await this.userRepository.createLoginHistory(loginHistory)
      }
      if (refreshToken) {
        // store refreshToken
        await this.userRepository.storeToken(refreshToken, {
          secret: config.JWT_SECRET_REFRESH_TOKEN,
        })
      }

      return { accessToken, refreshToken }
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
