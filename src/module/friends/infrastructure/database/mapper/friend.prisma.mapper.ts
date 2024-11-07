import { type Friend as PrismaFriend } from "@prisma/client"
import { Friend } from "src/module/friends/domain/entity/friend.entity"

export class FriendMapper {
  // Convert Prisma Friend to Domain Friend
  static toDomain(prismaFriend: PrismaFriend): Friend {
    return new Friend({
      userId: prismaFriend.userId,
      friendId: prismaFriend.friendId,
      createdAt: prismaFriend.createdAt,
      updatedAt: prismaFriend.updatedAt,
      deletedAt: prismaFriend.deletedAt,
    })
  }

  // Convert Domain Friend to Prisma Friend format
  static toPersistence(domainFriend: Friend): PrismaFriend {
    return {
      userId: domainFriend.userId,
      friendId: domainFriend.friendId,
      createdAt: domainFriend.createdAt,
      updatedAt: domainFriend.updatedAt,
      deletedAt: domainFriend.deletedAt,
    }
  }
}
