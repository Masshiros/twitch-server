import { QueryHandler } from "@nestjs/cqrs"
import {
  QueryError,
  QueryErrorCode,
  QueryErrorDetailCode,
} from "libs/exception/application/query"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { ImageService } from "src/module/image/application/image.service"
import { EImageType } from "src/module/image/domain/enum/image-type.enum"
import { IPostsRepository } from "src/module/posts/domain/repository/posts.interface.repository"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { GetPostCommentQuery } from "./get-post-comment.query"
import {
  getPostCommentResult,
  postCommentResult,
} from "./get-post-comment.result"

@QueryHandler(GetPostCommentQuery)
export class GetPostCommentHandler {
  constructor(
    private readonly postRepository: IPostsRepository,
    private readonly userRepository: IUserRepository,
    private readonly imageService: ImageService,
  ) {}
  async execute(query: GetPostCommentQuery): Promise<getPostCommentResult> {
    const { postId } = query
    try {
      if (!postId || postId.length === 0) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: "Post id can not be empty",
          info: {
            errorCode: QueryErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
            field: "postId",
          },
        })
      }

      const post = await this.postRepository.findPostById(postId)
      if (!post) {
        throw new QueryError({
          code: QueryErrorCode.NOT_FOUND,
          message: "Post not found",
        })
      }
      const comments = await this.postRepository.getCommentByPost(post)
      if (!comments) {
        return { comments: [] }
      }
      const result = await Promise.all(
        comments.map(async (comment) => this.mapCommentToResult(comment)),
      )
      return { comments: result.filter((e) => e !== null) }
    } catch (err) {
      if (
        err instanceof DomainError ||
        err instanceof QueryError ||
        err instanceof InfrastructureError
      ) {
        throw err
      }

      throw new QueryError({
        code: QueryErrorCode.INTERNAL_SERVER_ERROR,
        message: err.message,
      })
    }
  }
  private async mapCommentToResult(comment): Promise<postCommentResult> {
    const owner = await this.userRepository.findById(comment.userId)
    const ownerImages = await this.imageService.getImageByApplicableId(owner.id)
    const ownerAvatar = ownerImages.find(
      (e) => e.imageType === EImageType.AVATAR,
    )
    const userResult = {
      id: owner.id,
      username: owner.name,
      image: ownerAvatar ?? "",
    }

    const replies = await this.loadReplies(comment.id)
    return {
      user: userResult,
      content: comment.content,
      replies: replies,
    }
  }

  private async loadReplies(commentId: string): Promise<postCommentResult[]> {
    const replies = await this.postRepository.getRepliesByCommentId(commentId)
    return Promise.all(replies.map((reply) => this.mapCommentToResult(reply)))
  }
}
