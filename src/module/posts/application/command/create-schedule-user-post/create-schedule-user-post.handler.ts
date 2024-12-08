import { CommandHandler } from "@nestjs/cqrs"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { Events } from "libs/constants/events"
import { Folder } from "libs/constants/folder"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { IFriendRepository } from "src/module/friends/domain/repository/friend.interface.repository"
import { ImageService } from "src/module/image/application/image.service"
import { EImage } from "src/module/image/domain/enum/image.enum"
import { Post } from "src/module/posts/domain/entity/posts.entity"
import { EUserPostVisibility } from "src/module/posts/domain/enum/posts.enum"
import { PostCreateEvent } from "src/module/posts/domain/events/post-create.event"
import { PostFactory } from "src/module/posts/domain/factory/posts.factory"
import { IPostsRepository } from "src/module/posts/domain/repository/posts.interface.repository"
import { UserAggregate } from "src/module/users/domain/aggregate"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { CreateScheduleUserPostCommand } from "./create-schedule-user-post.command"

@CommandHandler(CreateScheduleUserPostCommand)
export class CreateScheduleUserPostHandler {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly friendRepository: IFriendRepository,
    private readonly imageService: ImageService,
    private readonly postRepository: IPostsRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async execute(command: CreateScheduleUserPostCommand): Promise<void> {
    const {
      userId,
      content,
      images,
      visibility,
      taggedUserIds,
      listUserViewIds,
      scheduledAt,
    } = command
    let savedImages
    let post: Post
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
      post = PostFactory.createPost({
        userId,
        content,
        visibility,
        isPublic: false,
      })
      if (!post) {
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
          post.id,
          EImage.POST,
        )
      }
      if (!images || images.length === 0) {
        this.eventEmitter.emit(
          Events.post.create,
          new PostCreateEvent(post, userId),
        )
      }
      await this.postRepository.createPost(post, taggedUserIds)
      await this.handleVisibilityPermission(
        visibility,
        post,
        user,
        listUserViewIds,
      )
      const schedulePost = PostFactory.createSchedulePost({
        userId: user.id,
        postId: post.id,
        scheduledAt,
      })
      await this.postRepository.createScheduledPost(schedulePost)
    } catch (err) {
      savedImages = await this.imageService.getImageByApplicableId(post.id)
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
  private async handleVisibilityPermission(
    visibility: EUserPostVisibility,
    post: Post,
    user: UserAggregate,
    listUserViewIds?: string[],
  ) {
    try {
      switch (visibility) {
        case EUserPostVisibility.PUBLIC:
          break
        case EUserPostVisibility.FRIENDS_ONLY:
          //TODO(friend): get friend lists
          const friends = await this.friendRepository.getFriends(user)
          if (friends && friends.length > 0) {
            const listUserView = await Promise.all(
              friends.map(async (e) => {
                const user = await this.userRepository.findById(e.friendId)
                if (!user) {
                  throw new CommandError({
                    code: CommandErrorCode.NOT_FOUND,
                    message: "User in view list not found",
                    info: {
                      errorCode: CommandErrorDetailCode.USER_NOT_FOUND,
                    },
                  })
                }
                return user
              }),
            )
            await this.postRepository.addUserViews(listUserView, post)
          }
          if (friends.length === 0) {
            throw new CommandError({
              code: CommandErrorCode.BAD_REQUEST,
              message: "You do not have friends",
            })
          }

          break
        case EUserPostVisibility.SPECIFIC:
          if (listUserViewIds && listUserViewIds.length > 0) {
            const listUserView = await Promise.all(
              listUserViewIds.map(async (userId) => {
                const user = await this.userRepository.findById(userId)
                if (!user) {
                  throw new CommandError({
                    code: CommandErrorCode.NOT_FOUND,
                    message: "User in view list not found",
                    info: {
                      errorCode: CommandErrorDetailCode.USER_NOT_FOUND,
                    },
                  })
                }
                return user
              }),
            )
            await this.postRepository.addUserViews(listUserView, post)
          }
          break
        case EUserPostVisibility.ONLY_ME:
          await this.postRepository.addUserView(user, post)
          break
        default:
          break
      }
    } catch (err) {
      await this.postRepository.deletePost(post)
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
