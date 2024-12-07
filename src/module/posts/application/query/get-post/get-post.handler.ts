import { QueryHandler } from "@nestjs/cqrs"
import { EReactionType } from "libs/constants/enum"
import { QueryError, QueryErrorCode } from "libs/exception/application/query"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { ImageService } from "src/module/image/application/image.service"
import { EImageType } from "src/module/image/domain/enum/image-type.enum"
import { IPostsRepository } from "src/module/posts/domain/repository/posts.interface.repository"
import { PostRedisDatabase } from "src/module/posts/infrastructure/database/redis/post.redis.database"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { GetPostResult } from "./get-post-result"
import { GetPostQuery } from "./get-post.query"

@QueryHandler(GetPostQuery)
export class GetPostHandler {
  constructor(
    private readonly cachePostDatabase: PostRedisDatabase,
    private readonly userRepository: IUserRepository,
    private readonly imageService: ImageService,
    private readonly postRepository: IPostsRepository,
  ) {}
  async execute(query: GetPostQuery): Promise<GetPostResult> {
    const { userId, postId } = query

    try {
      const post = await this.postRepository.findPostById(postId)
      console.log(post)
      const [images, owner] = await Promise.all([
        this.imageService.getImageByApplicableId(post.id),
        this.userRepository.findById(post.userId),
      ])

      const ownerImages = await this.imageService.getImageByApplicableId(
        owner.id,
      )
      const ownerAvatar = ownerImages.find(
        (e) => e.imageType === EImageType.AVATAR,
      )
      const [reactions, comments] = await Promise.all([
        this.postRepository.getPostReactions(post),
        this.postRepository.getCommentByPost(post),
      ])
      const currentReaction = reactions.find((e) => e.userId === userId)
      const reactionCounts = Object.values(EReactionType)
        .map((reactionType) => {
          return {
            type: reactionType,
            count:
              reactions.filter((reaction) => reaction.type === reactionType)
                .length || 0,
          }
        })
        .sort((a, b) => b.count - a.count)

      return {
        post: {
          user: {
            id: owner.id,
            username: owner.name,
            avatar: ownerAvatar?.url ?? "",
          },
          info: {
            id: post.id,
            createdAt: post.createdAt,
            visibility: post.visibility,
            content: post.content,
            images: images.map((i) => ({ url: i.url })),
            viewCount: post.totalViewCount,
            commentCount: comments.length ?? 0,
            reactionCount: reactions.length ?? 0,
            reactions: reactionCounts.filter((e) => e.count !== 0),
            currentReaction: currentReaction.type,
          },
        },
      }
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
}
