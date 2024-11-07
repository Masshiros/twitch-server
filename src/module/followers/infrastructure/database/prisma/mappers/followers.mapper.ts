import { Follower as PrismaFollower } from "@prisma/client"
import { Follower } from "src/module/followers/domain/entity/followers.entity"

export class FollowerMapper {
  static toDomain(prismaFollower: PrismaFollower): Follower {
    return new Follower(
      prismaFollower.sourceUserId,
      prismaFollower.destinationUserId,
      prismaFollower.createdAt,
      prismaFollower.updatedAt,
      prismaFollower.deletedAt,
    )
  }

  static toPersistence(domainFollower: Follower): PrismaFollower {
    return {
      sourceUserId: domainFollower.sourceUserId,
      destinationUserId: domainFollower.destinationUserId,
      followDate: domainFollower.followDate,
      createdAt: domainFollower.createdAt,
      updatedAt: domainFollower.updatedAt,
      deletedAt: domainFollower.deletedAt,
    }
  }
}
