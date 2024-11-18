import { PostComment as PrismaComment } from "@prisma/client"
import { Comment } from "src/module/posts/domain/entity/comments.entity"

export class CommentMapper {
  static toDomain(prismaComment: PrismaComment): Comment {
    return new Comment({
      id: prismaComment.id,
      content: prismaComment.content,
      userId: prismaComment.userId,
      postId: prismaComment.postId,
      parentId: prismaComment.parentId,
      createdAt: prismaComment.createdAt,
      updatedAt: prismaComment.updatedAt,
      deletedAt: prismaComment.deletedAt,
    })
  }

  static toPersistence(domainComment: Comment): PrismaComment {
    return {
      id: domainComment.id,
      content: domainComment.content,
      userId: domainComment.userId,
      postId: domainComment.postId,
      parentId: domainComment.parentId,
      createdAt: domainComment.createdAt,
      updatedAt: domainComment.updatedAt,
      deletedAt: domainComment.deletedAt,
    }
  }
}
