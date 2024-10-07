import { Token as PrismaToken } from "@prisma/client"
import { Token } from "src/module/users/domain/entity/tokens.entity"

export class TokenMapper {
  // Map Prisma Token entity to Domain Token Aggregate
  static toDomain(prismaToken: PrismaToken): Token {
    return new Token({
      userId: prismaToken.userId,
      deviceId: prismaToken.deviceId,
      token: prismaToken.token,
      expiresAt: prismaToken.expiresAt,
    })
  }

  // Map Domain Token Aggregate to Prisma Token entity
  static toPersistence(domainToken: Token): PrismaToken {
    return {
      id: domainToken.id,
      userId: domainToken.userId,
      deviceId: domainToken.deviceId,
      token: domainToken.token,
      expiresAt: domainToken.expiresAt,
      createdAt: domainToken.createdAt,
      updatedAt: domainToken.updatedAt,
      deletedAt: domainToken.deletedAt,
    }
  }
}
