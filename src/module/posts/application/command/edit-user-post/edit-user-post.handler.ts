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
import { PostUpdateEvent } from "src/module/posts/domain/events/post-update.event"
import { IPostsRepository } from "src/module/posts/domain/repository/posts.interface.repository"
import { UserAggregate } from "src/module/users/domain/aggregate"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { EditUserPostCommand } from "./edit-user-post.command"

@CommandHandler(EditUserPostCommand)
export class EditUserPostHandler {
  constructor(
    private readonly postRepository: IPostsRepository,
    private readonly userRepository: IUserRepository,
    private readonly imageService: ImageService,
    private readonly friendRepository: IFriendRepository,

    private readonly eventEmitter: EventEmitter2,
  ) {}
  async execute(command: EditUserPostCommand) {
    const {
      postId,
      userId,
      content,
      visibility,
      images,
      taggedUserIds,
      listUserViewIds,
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
      if (!postId || postId.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Post to edit's id can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
            field: "postId",
          },
        })
      }
      const user = await this.userRepository.findById(userId)
      if (!user) {
        throw new CommandError({
          code: CommandErrorCode.NOT_FOUND,
          message: "User not found",
          info: {
            errorCode: CommandErrorDetailCode.USER_NOT_FOUND,
          },
        })
      }
      post = await this.postRepository.findPostById(postId)
      if (!post) {
        throw new CommandError({
          code: CommandErrorCode.NOT_FOUND,
          message: "Post not found",
          info: {
            errorCode: CommandErrorDetailCode.NOT_FOUND,
          },
        })
      }
      if (post.userId !== user.id) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "This post is not belong to you",
          info: {
            errorCode: CommandErrorDetailCode.UNAUTHORIZED,
          },
        })
      }
      if (content) {
        post.content = content
      }
      if (visibility) {
        post.visibility = visibility
        await this.handleVisibilityPermission(
          visibility,
          post,
          user,
          listUserViewIds,
        )
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
      //   console.log(images)
      if (images && images.length > 0) {
        savedImages = await this.imageService.getImageByApplicableId(post.id)
        // savedImages.map((i) => console.log(i.publicId))
        if (savedImages) {
          await this.imageService.removeMultipleImages(savedImages!)
        }
        await this.imageService.uploadMultiImages(
          images,
          Folder.image.user_post,
          post.id,
          EImage.POST,
        )
      }
      if (!images || images.length === 0) {
        this.eventEmitter.emit(Events.post.create, new PostUpdateEvent(post))
      }
      await this.postRepository.updatePost(post, taggedUserIds)
    } catch (err) {
      console.error(err)

      if (savedImages) {
        await this.imageService.removeMultipleImages(savedImages!)
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
    switch (visibility) {
      case EUserPostVisibility.PUBLIC:
        await this.postRepository.removePostUserViews(post)
        break
      case EUserPostVisibility.FRIENDS_ONLY:
        //TODO(friend):Get friend list
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
        const specificUsers = await Promise.all(
          (listUserViewIds ?? []).map(async (id) => {
            const user = await this.userRepository.findById(id)
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
        await this.postRepository.removeUserViews(specificUsers, post)
        await this.postRepository.addUserViews(specificUsers, post)
        break
      case EUserPostVisibility.ONLY_ME:
        await this.postRepository.removeUserView(user, post)
        await this.postRepository.addUserView(user, post)
        break
    }
  }
}
