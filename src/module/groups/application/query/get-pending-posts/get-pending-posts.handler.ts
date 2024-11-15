import { QueryHandler } from "@nestjs/cqrs"
import {
  QueryError,
  QueryErrorCode,
  QueryErrorDetailCode,
} from "libs/exception/application/query"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { EGroupPostStatus } from "src/module/groups/domain/enum/group-post-status.enum"
import { IGroupRepository } from "src/module/groups/domain/repository/group.interface.repository"
import { ImageService } from "src/module/image/application/image.service"
import { EImageType } from "src/module/image/domain/enum/image-type.enum"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { GetPendingPostsQuery } from "./get-pending-posts.query"
import { GetPendingPostsResult } from "./get-pending-posts.result"

@QueryHandler(GetPendingPostsQuery)
export class GetPendingPostsHandler {
  constructor(
    private readonly groupRepository: IGroupRepository,
    private readonly userRepository: IUserRepository,
    private readonly imageService: ImageService,
  ) {}
  async execute(query: GetPendingPostsQuery): Promise<GetPendingPostsResult> {
    const { userId, groupId, limit, offset, order, orderBy } = query
    try {
      if (!userId || userId.length === 0) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: "User id can not be empty",
          info: {
            errorCode: QueryErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
          },
        })
      }
      if (!groupId || groupId.length === 0) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: "Group id can not be empty",
          info: {
            errorCode: QueryErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
          },
        })
      }
      const group = await this.groupRepository.findGroupById(groupId)
      if (!group) {
        throw new QueryError({
          code: QueryErrorCode.NOT_FOUND,
          message: "Group not found",
          info: {
            errorCode: QueryErrorDetailCode.NOT_FOUND,
          },
        })
      }
      const user = await this.userRepository.findById(userId)
      if (!user) {
        throw new QueryError({
          code: QueryErrorCode.NOT_FOUND,
          message: "User not found",
          info: {
            errorCode: QueryErrorDetailCode.NOT_FOUND,
          },
        })
      }
      const member = await this.groupRepository.findMemberById(
        group.id,
        user.id,
      )
      if (!member) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: "You are not member of this group",
        })
      }
      if (group.ownerId !== user.id) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: "You do not have permission to do this action",
          info: {
            errorCode: QueryErrorDetailCode.UNAUTHORIZED,
          },
        })
      }
      const groupPosts = await this.groupRepository.getGroupPosts(group, {
        limit,
        offset,
        order,
        orderBy,
      })
      const result = await Promise.all(
        groupPosts
          .filter((e) => e.status === EGroupPostStatus.PENDING)
          .map(async (p) => {
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
            return {
              user: {
                id: owner.id,
                username: owner?.name ?? "",
                avatar: ownerAvatar?.url ?? "",
              },
              createdAt: p.createdAt.toISOString().split("T")[0],
              content: p.content,
              images: images?.map((i) => ({ url: i.url })) ?? [],
            }
          }),
      )
      return { posts: result }
    } catch (error) {
      console.log(error)
      if (
        error instanceof DomainError ||
        error instanceof QueryError ||
        error instanceof InfrastructureError
      ) {
        throw error
      }

      throw new QueryError({
        code: QueryErrorCode.INTERNAL_SERVER_ERROR,
        message: "Internal Server Error",
      })
    }
  }
}
