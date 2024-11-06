import {
  type Post as PrismaPost,
  type EUserPostVisibility as PrismaVisibility,
} from "@prisma/client"
import { Post } from "src/module/posts/domain/entity/posts.entity"
import { EUserPostVisibility as DomainVisibility } from "src/module/posts/domain/enum/posts.enum"

export class PostMapper {
  // Convert Prisma Post to Domain PostAggregate
  static toDomain(prismaPost: PrismaPost): Post {
    return new Post({
      id: prismaPost.id,
      userId: prismaPost.userId,
      groupId: prismaPost.groupId,
      content: prismaPost.content,
      visibility: this.mapPrismaToDomainEnum(prismaPost.visibility),
      totalViewCount: prismaPost.totalViewCount,
      createdAt: prismaPost.createdAt,
      updatedAt: prismaPost.updatedAt,
    })
  }

  // Convert Domain PostA to Prisma Post format
  static toPersistence(domainPost: Post): PrismaPost {
    return {
      id: domainPost.id,
      userId: domainPost.userId,
      groupId: domainPost.groupId,
      content: domainPost.content,
      visibility: this.mapDomainToPrismaEnum(domainPost.visibility),
      totalViewCount: domainPost.totalViewCount,
      createdAt: domainPost.createdAt,
      updatedAt: domainPost.updatedAt,
      deletedAt: domainPost.deletedAt,
    }
  }

  // Map Prisma visibility enum to Domain visibility enum
  private static mapPrismaToDomainEnum(
    prismaEnum: PrismaVisibility,
  ): DomainVisibility {
    switch (prismaEnum) {
      case "PUBLIC":
        return DomainVisibility.PUBLIC
      case "FRIENDS_ONLY":
        return DomainVisibility.FRIENDS_ONLY
      case "SPECIFIC":
        return DomainVisibility.SPECIFIC
      case "ONLY_ME":
        return DomainVisibility.ONLY_ME
      default:
        throw new Error(`Unknown Prisma Enum value: ${prismaEnum}`)
    }
  }

  // Map Domain visibility enum to Prisma visibility enum
  private static mapDomainToPrismaEnum(
    domainEnum: DomainVisibility,
  ): PrismaVisibility {
    switch (domainEnum) {
      case DomainVisibility.PUBLIC:
        return "PUBLIC"
      case DomainVisibility.FRIENDS_ONLY:
        return "FRIENDS_ONLY"
      case DomainVisibility.SPECIFIC:
        return "SPECIFIC"
      case DomainVisibility.ONLY_ME:
        return "ONLY_ME"
      default:
        throw new Error(`Unknown Domain Enum value: ${domainEnum}`)
    }
  }
}
