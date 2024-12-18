import { ScheduledGroupPost as PrismaScheduledPost } from "@prisma/client"
import { ScheduledGroupPost } from "src/module/groups/domain/entity/scheduled-posts.entity"

export class ScheduledPostMapper {
  static toDomain(
    prismaScheduledPost: PrismaScheduledPost,
  ): ScheduledGroupPost {
    return new ScheduledGroupPost({
      id: prismaScheduledPost.id,
      groupId: prismaScheduledPost.groupId,
      userId: prismaScheduledPost.userId,
      postId: prismaScheduledPost.postId,
      scheduledAt: prismaScheduledPost.scheduledAt,
      createdAt: prismaScheduledPost.createdAt,
      updatedAt: prismaScheduledPost.updatedAt,
    })
  }

  static toPersistence(
    domainScheduledPost: ScheduledGroupPost,
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
