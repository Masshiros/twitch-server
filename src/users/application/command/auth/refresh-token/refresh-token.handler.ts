import { CommandHandler } from "@nestjs/cqrs"
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
      // validate token later
      // sign new tokens and delete old rt
      const { sub, email, username, deviceId } =
        await this.userRepository.decodeToken(refreshToken)
      const accessTokenPayload: TokenPayload = {
        sub,
        email,
        username,
        tokenType: tokenType.AccessToken,
        // TODO(device): handle device id later
        deviceId: "device-id",
        // add others later
        // TODO(role): Add role
      }
      const refreshTokenPayload: TokenPayload = {
        sub,
        email,
        username,
        // TODO(device): handle device id later
        deviceId,
        tokenType: tokenType.RefreshToken,
        // add others later
        // TODO(role): Add role
      }
      const [newAccessToken, newRefreshToken] = await Promise.all([
        this.userRepository.generateToken(accessTokenPayload),
        this.userRepository.generateToken(refreshTokenPayload),
        this.userRepository.decodeToken(refreshToken),
      ])
      // save new rt to db
      await this.userRepository.storeToken(newRefreshToken)
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
