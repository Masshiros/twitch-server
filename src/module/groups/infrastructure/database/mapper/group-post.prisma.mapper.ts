// src/module/groups/infrastructure/mappers/groupPostMapper.ts

import { GroupPost as PrismaGroupPost } from "@prisma/client"
import { GroupPost } from "src/module/groups/domain/entity/group-posts.entity"
import { EGroupPostStatus } from "src/module/groups/domain/enum/group-post-status.enum"

export class GroupPostMapper {
  static toDomain(prismaGroupPost: PrismaGroupPost): GroupPost {
    return new GroupPost({
      id: prismaGroupPost.id,
      groupId: prismaGroupPost.groupId,
      userId: prismaGroupPost.userId,
      tagByGroupPostId: prismaGroupPost.tagByGroupPostId,
      content: prismaGroupPost.content,
      totalViewCount: prismaGroupPost.totalViewCount,
      isPublic: prismaGroupPost.isPublic,
      status: prismaGroupPost.status as EGroupPostStatus,
      createdAt: prismaGroupPost.createdAt,
      updatedAt: prismaGroupPost.updatedAt,
      deletedAt: prismaGroupPost.deletedAt || null,
    })
  }

  static toPersistence(domainGroupPost: GroupPost): PrismaGroupPost {
    return {
      id: domainGroupPost.id,
      groupId: domainGroupPost.groupId,
      userId: domainGroupPost.userId,
      tagByGroupPostId: domainGroupPost.tagByGroupPostId,
      content: domainGroupPost.content,
      totalViewCount: domainGroupPost.totalViewCount,
      isPublic: domainGroupPost.isPublic,
      status: domainGroupPost.status,
      createdAt: domainGroupPost.createdAt,
      updatedAt: domainGroupPost.updatedAt,
      deletedAt: domainGroupPost.deletedAt,
    }
  }
}
