import { CommandHandler } from "@nestjs/cqrs"
import { Folder } from "libs/constants/folder"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { GroupPost } from "src/module/groups/domain/entity/group-posts.entity"
import { Group } from "src/module/groups/domain/entity/groups.entity"
import { EGroupPostStatus } from "src/module/groups/domain/enum/group-post-status.enum"
import { EGroupRole } from "src/module/groups/domain/enum/group-role.enum"
import { GroupFactory } from "src/module/groups/domain/factory/groups.factory"
import { IGroupRepository } from "src/module/groups/domain/repository/group.interface.repository"
import { ImageService } from "src/module/image/application/image.service"
import { EImage } from "src/module/image/domain/enum/image.enum"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { CreateScheduleGroupPostCommand } from "./create-schedule-group-post.command"

@CommandHandler(CreateScheduleGroupPostCommand)
export class CreateScheduleGroupPostHandler {
  constructor(
    private readonly groupRepository: IGroupRepository,
    private readonly userRepository: IUserRepository,
    private readonly imageService: ImageService,
  ) {}
  async execute(command: CreateScheduleGroupPostCommand): Promise<void> {
    const {
      userId,
      content,
      groupId,
      images,
      taggedGroupIds,
      taggedUserIds,
      isPublic,
      scheduledAt,
    } = command
    let savedImages
    let groupPost: GroupPost
    try {
      if (!userId || userId.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "User id can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
            field: "userId",
          },
        })
      }
      if (!content || content.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Post content can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
            field: "content",
          },
        })
      }
      if (!groupId || groupId.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Group id can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
            field: "groupId",
          },
        })
      }
      if (!scheduledAt) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Please provide day when the post should be created",
        })
      }
      const user = await this.userRepository.findById(userId)
      if (!user) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "User not found",
          info: {
            errorCode: CommandErrorDetailCode.USER_NOT_FOUND,
          },
        })
      }
      const group = await this.groupRepository.findGroupById(groupId)
      if (!group) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Group not found",
          info: {
            errorCode: CommandErrorDetailCode.USER_NOT_FOUND,
          },
        })
      }
      const member = await this.groupRepository.findMemberById(
        group.id,
        user.id,
      )
      if (!member) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "You are not member of this group",
          info: {
            errorCode: CommandErrorDetailCode.UNAUTHORIZED,
          },
        })
      }
      if (member.role === EGroupRole.MEMBER) {
        groupPost = GroupFactory.createGroupPost({
          groupId,
          userId,
          content,
          isPublic,
          status: EGroupPostStatus.PENDING,
        })
      } else if (member.role === EGroupRole.ADMIN) {
        groupPost = GroupFactory.createGroupPost({
          groupId,
          userId,
          content,
          isPublic,
          status: EGroupPostStatus.APPROVED,
        })
      }
      if (!groupPost) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Cannot create post",
          info: {
            errorCode: CommandErrorDetailCode.SOMETHING_WRONG_HAPPEN,
          },
        })
      }
      if (taggedUserIds && taggedUserIds.length > 0) {
        await Promise.all(
          taggedUserIds.map(async (id) => {
            const taggedUser = await this.userRepository.findById(id)
            if (!taggedUser) {
              throw new CommandError({
                code: CommandErrorCode.NOT_FOUND,
                message: "Tag user not found",
                info: {
                  errorCode: CommandErrorDetailCode.USER_NOT_FOUND,
                },
              })
            }
          }),
        )
      }
      if (images && images.length > 0) {
        await this.imageService.uploadMultiImages(
          images,
          Folder.image.group_post,
          groupPost.id,
          EImage.GROUP_POST,
        )
      }
      let taggedGroups: Group[]
      if (taggedGroupIds && taggedGroupIds.length > 0) {
        taggedGroups = await Promise.all(
          taggedGroupIds.map(async (id) => {
            const taggedGroup = await this.groupRepository.findGroupById(id)
            if (!taggedGroup) {
              throw new CommandError({
                code: CommandErrorCode.NOT_FOUND,
                message: "Tag group not found",
                info: {
                  errorCode: CommandErrorDetailCode.NOT_FOUND,
                },
              })
            }

            return taggedGroup
          }),
        )
      }
      await this.groupRepository.addPost(groupPost, taggedUserIds, taggedGroups)
      const schedulePost = GroupFactory.createScheduledPost({
        groupId: group.id,
        postId: groupPost.id,
        userId: user.id,
        scheduledAt,
      })
      await this.groupRepository.createScheduledPost(schedulePost)
    } catch (err) {
      savedImages = await this.imageService.getImageByApplicableId(groupPost.id)
      if (savedImages) {
        await this.imageService.removeMultipleImages(savedImages)
      }
      if (
        err instanceof DomainError ||
        err instanceof CommandError ||
        err instanceof InfrastructureError
      ) {
        throw err
      }

      throw new CommandError({
        code: CommandErrorCode.INTERNAL_SERVER_ERROR,
        message: err.message,
      })
    }
  }
}
