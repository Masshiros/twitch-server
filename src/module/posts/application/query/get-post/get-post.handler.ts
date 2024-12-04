import { QueryHandler } from "@nestjs/cqrs"
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
    let posts
    let post
    try {
      const postFromCache = await this.cachePostDatabase.getPostByUserId(userId)
      if (postFromCache && postFromCache.length > 0) {
        posts = postFromCache
        post = posts.find((p) => p.id === postId)
        const owner = await this.userRepository.findById(post.id)
        const images = post.postImages
        const ownerImages = await this.imageService.getImageByApplicableId(
          owner.id,
        )
        const ownerAvatar = ownerImages.find(
          (e) => e.imageType === EImageType.AVATAR,
        )
        return {
          post: {
            user: {
              id: owner.id,
              username: owner.name,
              avatar: ownerAvatar?.url ?? "",
            },
            info: {
              id: post.id,
              createdAt: post.createdAt.toISOString().split("T")[0],
              visibility: post.visibility,
              content: post.content,
              images: images,
            },
          },
        }
      } else {
        posts = await this.postRepository.getUserPost(userId, {})
        post = posts.find((p) => p.id === postId)
        const owner = await this.userRepository.findById(post.id)
        const images = post.postImages
        const ownerImages = await this.imageService.getImageByApplicableId(
          owner.id,
        )
        const ownerAvatar = ownerImages.find(
          (e) => e.imageType === EImageType.AVATAR,
        )
        return {
          post: {
            user: {
              id: owner.id,
              username: owner.name,
              avatar: ownerAvatar?.url ?? "",
            },
            info: {
              id: post.id,
              createdAt: post.createdAt.toISOString().split("T")[0],
              visibility: post.visibility,
              content: post.content,
              images: images,
            },
          },
        }
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
