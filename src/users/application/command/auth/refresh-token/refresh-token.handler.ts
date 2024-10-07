import { CommandHandler } from "@nestjs/cqrs"
import config from "libs/config"
import { tokenType } from "libs/constants/enum"
import {
  CommandError,
  CommandErrorCode,
} from "libs/exception/application/command"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { TokenPayload } from "src/common/interface"
import { UserFactory } from "src/users/domain/factory/user"
import { IUserRepository } from "src/users/domain/repository/user"
import { RefreshTokenCommand } from "./refresh-token.command"
import { RefreshTokenCommandResult } from "./refresh-token.result"

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenCommandHandler {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userFactory: UserFactory,
  ) {}
  async execute(
    command: RefreshTokenCommand,
  ): Promise<RefreshTokenCommandResult> {
    const { refreshToken } = command
    try {
      // sign new tokens and delete old rt
      const { sub, email, username } = await this.userRepository.decodeToken(
        refreshToken,
        {
          secret: config.JWT_SECRET_REFRESH_TOKEN,
        },
      )
      const accessTokenPayload: TokenPayload = {
        sub,
        email,
        username,
        tokenType: tokenType.AccessToken,

        // add others later
        // TODO(role): Add role
      }
      const refreshTokenPayload: TokenPayload = {
        sub,
        email,
        username,
        tokenType: tokenType.RefreshToken,
        // add others later
        // TODO(role): Add role
      }
      const [newAccessToken, newRefreshToken] = await Promise.all([
        this.userRepository.generateToken(accessTokenPayload, {
          secret: config.JWT_SECRET_ACCESS_TOKEN,
          expiresIn: config.ACCESS_TOKEN_EXPIRES_IN,
        }),
        this.userRepository.generateToken(refreshTokenPayload, {
          secret: config.JWT_SECRET_REFRESH_TOKEN,
          expiresIn: config.REFRESH_TOKEN_EXPIRES_IN,
        }),
        this.userRepository.deleteToken(refreshToken),
      ])
      // save new rt to db
      await this.userRepository.storeToken(newRefreshToken, {
        secret: config.JWT_SECRET_REFRESH_TOKEN,
      })
      return { accessToken: newAccessToken, refreshToken: newRefreshToken }
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
        message: "Internal Server Error",
      })
    }
  }
}
