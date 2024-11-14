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
import { UserFactory } from "src/module/users/domain/factory/user"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
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
      const { sub, email, username, deviceId, role, permission, status } =
        await this.userRepository.decodeToken(refreshToken, {
          secret: config.JWT_SECRET_REFRESH_TOKEN,
        })
      const user = await this.userRepository.findById(sub)
      const [roles, permissions] = await Promise.all([
        this.userRepository.getUserRoles(user),
        this.userRepository.getUserPermissions(user),
      ])

      const roleNames = roles.map((r) => r.name)
      const permissionNames = permissions.map((p) => p.name)
      const accessTokenPayload: TokenPayload = {
        sub: user.id,
        email: user.email,
        username: user.name,
        tokenType: tokenType.AccessToken,
        deviceId: deviceId,
        role: roleNames,
        permission: permissionNames,
        status: user.status,
      }
      const refreshTokenPayload: TokenPayload = {
        sub: user.id,
        email: user.email,
        username: user.name,
        tokenType: tokenType.RefreshToken,
        deviceId: deviceId,
        role: roleNames,
        permission: permissionNames,
        status: user.status,
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
