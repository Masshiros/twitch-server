import { QueryHandler } from "@nestjs/cqrs"
import { EReactionType } from "libs/constants/enum"
import {
  QueryError,
  QueryErrorCode,
  QueryErrorDetailCode,
} from "libs/exception/application/query"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { ImageService } from "src/module/image/application/image.service"
import { EImageType } from "src/module/image/domain/enum/image-type.enum"
import { Post } from "src/module/posts/domain/entity/posts.entity"
import { IPostsRepository } from "src/module/posts/domain/repository/posts.interface.repository"
import { PostRedisDatabase } from "src/module/posts/infrastructure/database/redis/post.redis.database"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { GetUserPostsQuery } from "./get-user-posts.query"
import { GetUserPostsResult } from "./get-user-posts.result"

@QueryHandler(GetUserPostsQuery)
export class GetUserPostsHandler {
  constructor(
    private readonly postRepository: IPostsRepository,
    private readonly userRepository: IUserRepository,
    private readonly imageService: ImageService,
    private readonly postRedisDatabase: PostRedisDatabase,
    private readonly cachePostDatabase: PostRedisDatabase,
  ) {}
  async execute(query: GetUserPostsQuery): Promise<GetUserPostsResult> {
    const { currentUserId, username, limit, offset, order, orderBy } = query
    try {
      if (!username || username.length === 0) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: "User to get posts' name can not be empty",
          info: {
            errorCode: QueryErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
            field: "username",
          },
        })
      }
      // if (!currentUserId || currentUserId.length === 0) {
      //   throw new QueryError({
      //     code: QueryErrorCode.BAD_REQUEST,
      //     message: "Current user's id can not be empty",
      //     info: {
      //       errorCode: QueryErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
      //       field: "currentUserId",
      //     },
      //   })
      // }
      const user = await this.userRepository.findByUsername(username)
      // const currentUser = await this.userRepository.findById(currentUserId)
      if (!user) {
        throw new QueryError({
          code: QueryErrorCode.NOT_FOUND,
          message: "User not found",
          info: {
            errorCode: QueryErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
          },
        })
      }
      // if (!currentUser) {
      //   throw new QueryError({
      //     code: QueryErrorCode.NOT_FOUND,
      //     message: "Current user not found",
      //     info: {
      //       errorCode: QueryErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
      //     },
      //   })
      // }
      let combinedPosts: Post[] = []
      let userPosts: Post[] = []
      let userSharedPosts: Post[] = []
      let userTaggedPosts: Post[] = []
      const postFromCache = await this.postRedisDatabase.getPostByUserId(
        user.id,
      )
      if (postFromCache && postFromCache.length > 0) {
        combinedPosts = postFromCache
        console.log(combinedPosts)
      } else {
        ;[userPosts, userSharedPosts, userTaggedPosts] = await Promise.all([
          this.postRepository.getUserPost(user.id, {}),
          this.postRepository.getUserSharedPost(user),
          this.postRepository.getAllTagPost(user),
        ])
        combinedPosts = [...userPosts, ...userSharedPosts, ...userTaggedPosts]
      }

      const totalPosts = combinedPosts.length
      const totalPage = Math.ceil(totalPosts / limit)

      const paginatedPosts = combinedPosts
        .slice(offset, offset + limit)
        .filter((e) => e.isPublic === true)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

      const pageTotalPosts = paginatedPosts.length

      const result = await Promise.all(
        paginatedPosts.map(async (p) => {
          const [images, owner] = await Promise.all([
            this.imageService.getImageByApplicableId(p.id),
            this.userRepository.findById(p.userId),
          ])
          const [ownerImages, reactions, viewCount, comments] =
            await Promise.all([
              this.imageService.getImageByApplicableId(owner.id),
              this.postRepository.getPostReactions(p),
              this.cachePostDatabase.getPostViewByPostId(p.id),
              this.cachePostDatabase.getCommentsByPostId(p.id),
            ])
          const currentReaction = reactions.find((e) => e.userId === user.id)
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
          const ownerAvatar = ownerImages.find(
            (e) => e.imageType === EImageType.AVATAR,
          )

          // if (currentUserId !== user.id) {
          //   const hasPermission =
          //     await this.postRepository.hasUserViewPermission(p, currentUser)
          //   if (!hasPermission) {
          //     return null
          //   }
          // }

          if (!images || images.length === 0) {
            return {
              user: {
                id: owner.id,
                username: owner?.name ?? "",
                avatar: ownerAvatar?.url ?? "",
              },
              info: {
                id: p.id,
                createdAt: p.createdAt,
                visibility: p.visibility,
                content: p.content,
                images: [],
                isShared: userSharedPosts.some(
                  (sharedPost) => sharedPost.id === p.id,
                ),
                isTagged: userTaggedPosts.some(
                  (taggedPost) => taggedPost.id === p.id,
                ),
                viewCount: viewCount ?? p.totalViewCount,
                commentCount: comments.length,
                reactionCount: reactions.length,
                reactions: reactionCounts.filter((e) => e.count !== 0),
                currentReaction: currentReaction.type,
              },
            }
          }
          return {
            user: {
              id: owner.id,
              username: owner.name,
              avatar: ownerAvatar?.url ?? "",
            },
            info: {
              id: p.id,
              createdAt: p.createdAt,
              visibility: p.visibility,
              content: p.content,
              images: images.map((i) => ({ url: i.url })),
              isShared: userSharedPosts.some(
                (sharedPost) => sharedPost.id === p.id,
              ),
              isTagged: userTaggedPosts.some(
                (taggedPost) => taggedPost.id === p.id,
              ),
              viewCount: viewCount ?? p.totalViewCount,
              commentCount: comments.length,
              reactionCount: reactions.length,
              reactions: reactionCounts,
              currentReaction: currentReaction.type,
            },
          }
        }),
      )

      return {
        posts: result.filter((p) => p !== null),
        totalPosts,
        pageTotalPosts,
        totalPage,
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
