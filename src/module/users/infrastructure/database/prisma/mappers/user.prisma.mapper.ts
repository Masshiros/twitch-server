import { type User as PrismaUser } from "@prisma/client"
import { UserAggregate } from "src/module/users/domain/aggregate"
import { EUserStatus } from "src/module/users/domain/enum/user-status.enum"

export class UserMapper {
  static mapPrismaStatusToDomainStatus(
    status: PrismaUser["status"],
  ): EUserStatus {
    switch (status) {
      case "BANNED":
        return EUserStatus.BANNED
      case "VERIFIED":
        return EUserStatus.VERIFIED
      case "UNVERIFIED":
        return EUserStatus.UNVERIFIED
      default:
        throw new Error(`Unknown status: ${status}`)
    }
  }

  static toDomain(prismaUser: PrismaUser): UserAggregate {
    return new UserAggregate(
      {
        name: prismaUser.name,
        status: UserMapper.mapPrismaStatusToDomainStatus(prismaUser.status),
        displayName: prismaUser.displayName,
        slug: prismaUser.slug,
        email: prismaUser.email,
        password: prismaUser.password,
        phoneNumber: prismaUser.phoneNumber,
        dob: prismaUser.dob,
        emailVerifyToken: prismaUser.emailVerifyToken,
        phoneVerifyToken: prismaUser.phoneVerifyToken,
        forgotPasswordToken: prismaUser.forgotPasswordToken,
        otpToken: prismaUser.otpToken,
        isActive: prismaUser.isActive,
        is2FA: prismaUser.is2FA,
        streamKey: prismaUser.streamKey,
        serverUrl: prismaUser.serverUrl,
        view: prismaUser.view,
        bio: prismaUser.bio,
        lastUsernameChangeAt: prismaUser.lastUsernameChangeAt,
        isOnline: prismaUser.isOnline,
        offlineAt: prismaUser.offlineAt,
        thumbnail: prismaUser.thumbnail,
        createdAt: prismaUser.createdAt,
        updatedAt: prismaUser.updatedAt,
      },
      prismaUser.id,
    )
  }

  static toPersistence(domainUser: UserAggregate): PrismaUser {
    return {
      id: domainUser.id,
      status: domainUser.status,
      name: domainUser.name,
      displayName: domainUser.displayName,
      slug: domainUser.slug,
      email: domainUser.email,
      password: domainUser.password,
      phoneNumber: domainUser.phoneNumber,
      dob: domainUser.dob,
      emailVerifyToken: domainUser.emailVerifyToken,
      phoneVerifyToken: domainUser.phoneVerifyToken,
      forgotPasswordToken: domainUser.forgotPasswordToken,
      otpToken: domainUser.otpToken,
      isActive: domainUser.isActive,
      is2FA: domainUser.is2FA,
      view: domainUser.view,
      bio: domainUser.bio,
      lastUsernameChangeAt: domainUser.lastUsernameChangeAt,
      isOnline: domainUser.isOnline,
      offlineAt: domainUser.offlineAt,
      serverUrl: domainUser.serverUrl,
      streamKey: domainUser.streamKey,
      thumbnail: domainUser.thumbnail,
      createdAt: domainUser.createdAt,
      updatedAt: domainUser.updatedAt,
      deletedAt: domainUser.deletedAt,
    }
  }
}
