import { CommandHandler } from "@nestjs/cqrs"
import config from "libs/config"
import { tokenType } from "libs/constants/enum"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { TokenPayload } from "src/common/interface"
import { IUserRepository } from "src/users/domain/repository/user"
import { compareToken } from "utils/encrypt"
import { ConfirmEmailCommand } from "./confirm-email.command"
import { ConfirmEmailCommandResult } from "./confirm-email.result"

@CommandHandler(ConfirmEmailCommand)
export class ConfirmEmailCommandHandler {
  constructor(private readonly userRepository: IUserRepository) {}
  async execute(
    command: ConfirmEmailCommand,
  ): Promise<ConfirmEmailCommandResult> {
    const { id, otp } = command

    // validate otp exist
    if (!otp) {
      throw new CommandError({
        code: CommandErrorCode.BAD_REQUEST,
        message: "OTP can not be empty",
        info: {
          errorCode: CommandErrorDetailCode.OTP_CAN_NOT_BE_EMPTY,
        },
      })
    }
    // verify current user
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new CommandError({
        code: CommandErrorCode.BAD_REQUEST,
        message: "User not found",
        info: {
          errorCode: CommandErrorDetailCode.USER_NOT_FOUND,
        },
      })
    }
    // check whether the user is verified
    if (user.emailVerifyToken === "") {
      throw new CommandError({
        code: CommandErrorCode.BAD_REQUEST,
        message: "User email has been already verified before",
        info: {
          errorCode: CommandErrorDetailCode.EMAIL_VERIFIED_BEFORE,
        },
      })
    }
    // validate otp is true

    if (!(await compareToken(otp, user.emailVerifyToken))) {
      throw new CommandError({
        code: CommandErrorCode.BAD_REQUEST,
        message: "Invalid OTP",
        info: {
          errorCode: CommandErrorDetailCode.INVALID_OTP,
        },
      })
    }
    // generate AT and RT
    const accessTokenPayload: TokenPayload = {
      sub: user.id,
      email: user.email,
      username: user.name,
      tokenType: tokenType.AccessToken,

      deviceId: "device-id",
      // add others later
    }
    const refreshTokenPayload: TokenPayload = {
      sub: user.id,
      email: user.email,
      username: user.name,

      deviceId: "device-id",
      tokenType: tokenType.RefreshToken,
      // add others later
    }
    user.emailVerifyToken = ""
    const [accessToken, refreshToken] = await Promise.all([
      this.userRepository.generateToken(accessTokenPayload, {
        secret: config.JWT_SECRET_ACCESS_TOKEN,
        expiresIn: config.ACCESS_TOKEN_EXPIRES_IN,
      }),
      this.userRepository.generateToken(refreshTokenPayload, {
        secret: config.JWT_SECRET_REFRESH_TOKEN,
        expiresIn: config.REFRESH_TOKEN_EXPIRES_IN,
      }),
      this.userRepository.update(user),
    ])

    // store refreshToken
    await this.userRepository.storeToken(refreshToken, {
      secret: config.JWT_SECRET_REFRESH_TOKEN,
    })

    return { accessToken, refreshToken }
  }
}
