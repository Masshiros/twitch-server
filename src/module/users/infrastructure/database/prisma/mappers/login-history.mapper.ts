// src/user/mappers/login-history.mapper.ts

import { LoginHistory as PrismaLoginHistory } from "@prisma/client"
import { LoginHistory } from "src/module/users/domain/entity/login-histories.entity"

export class LoginHistoryMapper {
  static toDomain(prismaLoginHistory: PrismaLoginHistory): LoginHistory {
    return new LoginHistory(
      {
        userId: prismaLoginHistory.userId,
        deviceId: prismaLoginHistory.deviceId,
        loginAt: prismaLoginHistory.loginAt,
        loginStatus: prismaLoginHistory.loginStatus,
        reason: prismaLoginHistory.reason,
        createdAt: prismaLoginHistory.createdAt,
        updatedAt: prismaLoginHistory.updatedAt,
      },
      prismaLoginHistory.id,
    )
  }

  static toPersistence(domainLoginHistory: LoginHistory): PrismaLoginHistory {
    return {
      id: domainLoginHistory.id,
      userId: domainLoginHistory.userId,
      deviceId: domainLoginHistory.deviceId,
      loginAt: domainLoginHistory.loginAt,
      loginStatus: domainLoginHistory.loginStatus,
      reason: domainLoginHistory.reason,
      createdAt: domainLoginHistory.createdAt,
      updatedAt: domainLoginHistory.updatedAt,
      deletedAt: domainLoginHistory.deletedAt,
    }
  }
}
