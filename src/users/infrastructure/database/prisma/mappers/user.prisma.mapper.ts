// src/user/mappers/user.mapper.ts

import { type User as PrismaUser } from "@prisma/client"
import { UserAggregate } from "src/users/domain/aggregate"

export class UserMapper {
  static toDomain(prismaUser: PrismaUser): UserAggregate {
    return new UserAggregate(
      {
        categoryId: prismaUser.categoryId,
        name: prismaUser.name,
        slug: prismaUser.slug,
        email: prismaUser.email,
        password: prismaUser.password,
        phoneNumber: prismaUser.phoneNumber,
        dob: prismaUser.dob,
        emailVerified: prismaUser.emailVerified,
        phoneVerified: prismaUser.phoneVerified,
        isLive: prismaUser.isLive,
        view: prismaUser.view,
        bio: prismaUser.bio,
        avatar: prismaUser.avatar,
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
      categoryId: domainUser.categoryId,
      name: domainUser.name,
      slug: domainUser.slug,
      email: domainUser.email,
      password: domainUser.password,
      phoneNumber: domainUser.phoneNumber,
      dob: domainUser.dob,
      emailVerified: domainUser.emailVerified,
      phoneVerified: domainUser.phoneVerified,
      isLive: domainUser.isLive,
      view: domainUser.view,
      bio: domainUser.bio,
      avatar: domainUser.avatar,
      thumbnail: domainUser.thumbnail,
      createdAt: domainUser.createdAt,
      updatedAt: domainUser.updatedAt,
      deletedAt: domainUser.deletedAt,
    }
  }
}
