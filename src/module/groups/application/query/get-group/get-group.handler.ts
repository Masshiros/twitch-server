import { QueryHandler } from "@nestjs/cqrs"
import {
  QueryError,
  QueryErrorCode,
  QueryErrorDetailCode,
} from "libs/exception/application/query"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { EGroupPostStatus } from "src/module/groups/domain/enum/group-post-status.enum"
import { EGroupPrivacy } from "src/module/groups/domain/enum/group-privacy.enum"
import { EGroupRole } from "src/module/groups/domain/enum/group-role.enum"
import { EGroupVisibility } from "src/module/groups/domain/enum/group-visibility.enum"
import { IGroupRepository } from "src/module/groups/domain/repository/group.interface.repository"
import { ImageService } from "src/module/image/application/image.service"
import { EImageType } from "src/module/image/domain/enum/image-type.enum"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { GetGroupQuery } from "./get-group.query"
import { GetGroupResult } from "./get-group.result"

@QueryHandler(GetGroupQuery)
export class GetGroupHandler {
  constructor(
    private readonly groupRepository: IGroupRepository,
    private readonly userRepository: IUserRepository,
    private readonly imageService: ImageService,
  ) {}
  async execute(query: GetGroupQuery): Promise<GetGroupResult> {
    const { userId, groupId } = query
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
      let isAdmin = false
      let isMember = false
      let posts = null
      let description = null
      let rules = null
      const [coverImage, member] = await Promise.all([
        this.imageService.getImageByApplicableId(group.id),
        this.groupRepository.findMemberById(group.id, userId),
      ])

      if (member) {
        isMember = true
        isAdmin = member.role === EGroupRole.ADMIN
      }
      if (isMember || group.visibility === EGroupVisibility.PUBLIC) {
        description = group.description
        const [groupRules, groupPosts] = await Promise.all([
          this.groupRepository.getGroupRules(group, {}),
          this.groupRepository.getGroupPosts(group, {}),
        ])
        rules = groupRules.map((r) => {
          {
            title: r.title
            content: r.content
          }
        })
        posts = groupPosts
          .filter((e) => e.status === EGroupPostStatus.APPROVED)
          .map(async (p) => {
            let images = []
            let owner = null
            if (p.tagByGroupPostId) {
              ;[images, owner] = await Promise.all([
                this.imageService.getImageByApplicableId(p.tagByGroupPostId),
                this.userRepository.findById(p.userId),
              ])
            } else {
              ;[images, owner] = await Promise.all([
                this.imageService.getImageByApplicableId(p.id),
                this.userRepository.findById(p.userId),
              ])
            }

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
              id: p.id,
              createdAt: p.createdAt.toISOString().split("T")[0],
              content: p.content,
              images: images?.map((i) => ({ url: i.url })) ?? [],
            }
          })
      } else if (
        !member &&
        group.visibility === EGroupVisibility.PRIVATE &&
        group.privacy === EGroupPrivacy.VISIBLE
      ) {
        description = group.description
        const groupRules = await this.groupRepository.getGroupRules(group, {})
        rules = groupRules.map((r) => {
          {
            title: r.title
            content: r.content
          }
        })
      }
      return {
        id: group.id,
        name: group.name,
        privacy: group.privacy,
        visibility: group.visibility,
        coverImage: coverImage[0]?.url ?? "",
        description,
        rules,
        posts,
        isAdmin,
        isMember,
      }
    } catch (error) {
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
