import { JwtService } from "@nestjs/jwt"
import {
  InfrastructureError,
  InfrastructureErrorCode,
} from "libs/exception/infrastructure"
import { TokenPayload } from "src/common/interface"
import { Token } from "src/users/domain/entity/tokens.entity"
import { ITokenRepository } from "src/users/domain/repository/token"
import { TokenMapper } from "../mappers/token.prisma.mapper"
import { PrismaService } from "../prisma.service"

export class PrismaTokenRepository implements ITokenRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async generateToken(payload: TokenPayload): Promise<string> {
    try {
      return await this.jwtService.signAsync(payload)
    } catch (error) {
      if (error instanceof InfrastructureError) {
        throw error
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: "Internal Server Error",
      })
    }
  }
  async storeToken(token: string): Promise<void> {
    try {
      const [sub, deviceId] = await this.jwtService.verifyAsync(token)
      const tokenStored = new Token({
        userId: sub,
        token: token,
        deviceId: deviceId,
        // TODO(): handle jwt service later
        expiresAt: new Date(),
      })
      const data = TokenMapper.toPersistence(tokenStored)
      await this.prismaService.token.create({ data })
    } catch (error) {
      if (error instanceof InfrastructureError) {
        throw error
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: "Internal Server Error",
      })
    }
  }
}
