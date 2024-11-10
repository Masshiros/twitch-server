import {
  EReactionType as PrismaReactionType,
  type PostReaction as PrismaPostReaction,
} from "@prisma/client"
import { EReactionType as DomainReactionType } from "libs/constants/enum"
import { PostReactions } from "src/module/posts/domain/entity/post-reactions.entity"

export class PostReactionMapper {
  // Convert Prisma PostReaction to Domain PostReactions
  static toDomain(prismaPostReaction: PrismaPostReaction): PostReactions {
    return new PostReactions({
      id: prismaPostReaction.groupPostId,
      groupPostId: prismaPostReaction.groupPostId,
      userId: prismaPostReaction.userId,
      postId: prismaPostReaction.postId,
      type: this.mapPrismaToDomainEnum(prismaPostReaction.type),
    })
  }

  // Convert Domain PostReactions to Prisma PostReaction format
  static toPersistence(domainPostReaction: PostReactions): PrismaPostReaction {
    return {
      id: domainPostReaction.id,
      groupPostId: domainPostReaction.groupPostId,
      userId: domainPostReaction.userId,
      postId: domainPostReaction.postId,
      type: this.mapDomainToPrismaEnum(domainPostReaction.type),
      createdAt: domainPostReaction.createdAt,
      updatedAt: domainPostReaction.updatedAt,
      deletedAt: domainPostReaction.deletedAt,
    }
  }

  // Map Prisma reaction type enum to Domain reaction type enum
  private static mapPrismaToDomainEnum(
    prismaEnum: PrismaReactionType,
  ): DomainReactionType {
    switch (prismaEnum) {
      case "LIKE":
        return DomainReactionType.LIKE
      case "LOVE":
        return DomainReactionType.LOVE
      case "HAHA":
        return DomainReactionType.HAHA
      case "WOW":
        return DomainReactionType.WOW
      case "SAD":
        return DomainReactionType.SAD
      case "ANGRY":
        return DomainReactionType.ANGRY
      default:
        throw new Error(`Unknown Prisma Enum value: ${prismaEnum}`)
    }
  }

  // Map Domain reaction type enum to Prisma reaction type enum
  private static mapDomainToPrismaEnum(
    domainEnum: DomainReactionType,
  ): PrismaReactionType {
    switch (domainEnum) {
      case DomainReactionType.LIKE:
        return "LIKE"
      case DomainReactionType.LOVE:
        return "LOVE"
      case DomainReactionType.HAHA:
        return "HAHA"
      case DomainReactionType.WOW:
        return "WOW"
      case DomainReactionType.SAD:
        return "SAD"
      case DomainReactionType.ANGRY:
        return "ANGRY"
      default:
        throw new Error(`Unknown Domain Enum value: ${domainEnum}`)
    }
  }
}
