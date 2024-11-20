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
import { GetUserPostsQuery } from "./get-user-posts.query"
import { GetUserPostsResult } from "./get-user-posts.result"

@QueryHandler(GetUserPostsQuery)
export class GetUserPostsHandler {
  constructor(
    private readonly postRepository: IPostsRepository,
    private readonly userRepository: IUserRepository,
    private readonly imageService: ImageService,
  ) {}
  async execute(query: GetUserPostsQuery): Promise<GetUserPostsResult> {
    const { currentUserId, userId, limit, offset, order, orderBy } = query
    try {
      if (!userId || userId.length === 0) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: "User to get posts' id can not be empty",
          info: {
            errorCode: QueryErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
            field: "userId",
          },
        })
      }
      if (!currentUserId || currentUserId.length === 0) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: "Current user's id can not be empty",
          info: {
            errorCode: QueryErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
            field: "currentUserId",
          },
        })
      }
      const user = await this.userRepository.findById(userId)
      const currentUser = await this.userRepository.findById(currentUserId)
      if (!user) {
        throw new QueryError({
          code: QueryErrorCode.NOT_FOUND,
          message: "User not found",
          info: {
            errorCode: QueryErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
          },
        })
      }
      if (!currentUser) {
        throw new QueryError({
          code: QueryErrorCode.NOT_FOUND,
          message: "Current user not found",
          info: {
            errorCode: QueryErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
          },
        })
      }
      const [userPosts, userSharedPosts, userTaggedPosts] = await Promise.all([
        this.postRepository.getUserPost(userId, {
          limit,
          offset,
          orderBy,
          order,
        }),
        this.postRepository.getUserSharedPost(user),
        this.postRepository.getAllTagPost(user),
      ])
      const combinedPosts = [
        ...userPosts,
        ...userSharedPosts,
        ...userTaggedPosts,
      ]
      const result = await Promise.all(
        combinedPosts.map(async (p) => {
          const [images, owner] = await Promise.all([
            this.imageService.getImageByApplicableId(p.id),
            this.userRepository.findById(p.userId),
          ])
          const ownerImages = await this.imageService.getImageByApplicableId(
            owner.id,
          )
          const ownerAvatar = ownerImages.find(
            (e) => e.imageType === EImageType.AVATAR,
          )
          if (currentUserId !== userId) {
            const hasPermission =
              await this.postRepository.hasUserViewPermission(p, currentUser)
            if (!hasPermission) {
              return null
            }
          }

          if (!images || images.length === 0) {
            return {
              user: {
                id: owner.id,
                username: owner?.name ?? "",
                avatar: ownerAvatar[0]?.url ?? "",
              },
              info: {
                createdAt: p.createdAt.toISOString().split("T")[0],
                visibility: p.visibility,
                content: p.content,
                images: [],
                isShared: userSharedPosts.some(
                  (sharedPost) => sharedPost.id === p.id,
                ),
                isTagged: userTaggedPosts.some(
                  (taggedPost) => taggedPost.id === p.id,
                ),
              },
            }
          }
          return {
            user: {
              id: owner.id,
              username: owner.name,
              avatar: ownerAvatar[0]?.url ?? "",
            },
            info: {
              createdAt: p.createdAt.toISOString().split("T")[0],
              visibility: p.visibility,
              content: p.content,
              images: images.map((i) => ({ url: i.url })),
              isShared: userSharedPosts.some(
                (sharedPost) => sharedPost.id === p.id,
              ),
              isTagged: userTaggedPosts.some(
                (taggedPost) => taggedPost.id === p.id,
              ),
            },
          }
        }),
      )

      return { posts: result.filter((p) => p !== null) }
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
