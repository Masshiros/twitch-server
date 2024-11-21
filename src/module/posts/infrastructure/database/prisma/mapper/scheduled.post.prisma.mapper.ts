import { ScheduledPost as PrismaScheduledPost } from "@prisma/client"
import { ScheduledPost } from "src/module/posts/domain/entity/scheduled-post.entity"

export class ScheduledPostMapper {
  static toDomain(prismaScheduledPost: PrismaScheduledPost): ScheduledPost {
    return new ScheduledPost({
      id: prismaScheduledPost.id,
      userId: prismaScheduledPost.userId,
      postId: prismaScheduledPost.postId,
      scheduledAt: prismaScheduledPost.scheduledAt,
      createdAt: prismaScheduledPost.createdAt,
      updatedAt: prismaScheduledPost.updatedAt,
    })
  }

  static toPersistence(
    domainScheduledPost: ScheduledPost,
  ): PrismaScheduledPost {
    return {
      id: domainScheduledPost.id,
      userId: domainScheduledPost.userId,
      postId: domainScheduledPost.postId,
      scheduledAt: domainScheduledPost.scheduledAt,
      createdAt: domainScheduledPost.createdAt,
      updatedAt: domainScheduledPost.updatedAt,
    }
  }
}
