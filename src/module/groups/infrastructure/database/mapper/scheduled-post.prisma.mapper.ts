import { ScheduledPost as PrismaScheduledPost } from "@prisma/client"
import { ScheduledPost } from "src/module/groups/domain/entity/scheduled-posts.entity"

export class ScheduledPostMapper {
  static toDomain(prismaScheduledPost: PrismaScheduledPost): ScheduledPost {
    return new ScheduledPost({
      id: prismaScheduledPost.id,
      groupId: prismaScheduledPost.groupId,
      userId: prismaScheduledPost.userId,
      postId: prismaScheduledPost.postId,
      scheduledAt: prismaScheduledPost.scheduledAt,
      createdAt: prismaScheduledPost.createdAt,
      updatedAt: prismaScheduledPost.updatedAt,
    })
  }

  // Convert Domain ScheduledPost to Prisma ScheduledPost
  static toPersistence(
    domainScheduledPost: ScheduledPost,
  ): PrismaScheduledPost {
    return {
      id: domainScheduledPost.id,
      groupId: domainScheduledPost.groupId,
      userId: domainScheduledPost.userId,
      postId: domainScheduledPost.postId,
      scheduledAt: domainScheduledPost.scheduledAt,
      createdAt: domainScheduledPost.createdAt,
      updatedAt: domainScheduledPost.updatedAt,
    }
  }
}
