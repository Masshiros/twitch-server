// src/module/groups/infrastructure/mappers/groupPostMapper.ts

import { GroupPost as PrismaGroupPost } from "@prisma/client"
import { GroupPost } from "src/module/groups/domain/entity/group-posts.entity"
import { EGroupPostStatus } from "src/module/groups/domain/enum/group-post-status.enum"

export class GroupPostMapper {
  // Convert Prisma GroupPost to Domain GroupPost
  static toDomain(prismaGroupPost: PrismaGroupPost): GroupPost {
    return new GroupPost({
      id: prismaGroupPost.id,
      groupId: prismaGroupPost.groupId,
      userId: prismaGroupPost.userId,
      content: prismaGroupPost.content,
      totalViewCount: prismaGroupPost.totalViewCount,
      status: prismaGroupPost.status as EGroupPostStatus,
      createdAt: prismaGroupPost.createdAt,
      updatedAt: prismaGroupPost.updatedAt,
      deletedAt: prismaGroupPost.deletedAt || null,
    })
  }

  // Convert Domain GroupPost to Prisma GroupPost
  static toPersistence(domainGroupPost: GroupPost): PrismaGroupPost {
    return {
      id: domainGroupPost.id,
      groupId: domainGroupPost.groupId,
      userId: domainGroupPost.userId,
      content: domainGroupPost.content,
      totalViewCount: domainGroupPost.totalViewCount,
      status: domainGroupPost.status,
      createdAt: domainGroupPost.createdAt,
      updatedAt: domainGroupPost.updatedAt,
      deletedAt: domainGroupPost.deletedAt,
    }
  }
}
