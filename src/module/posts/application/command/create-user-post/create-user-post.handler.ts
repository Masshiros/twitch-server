import { CommandHandler } from "@nestjs/cqrs"
import { Folder } from "libs/constants/folder"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { ImageService } from "src/module/image/application/image.service"
import { EImage } from "src/module/image/domain/enum/image.enum"
import { PostFactory } from "src/module/posts/domain/factory/posts.factory"
import { IPostsRepository } from "src/module/posts/domain/repository/posts.interface.repository"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { CreateUserPostCommand } from "./create-user-post.command"

@CommandHandler(CreateUserPostCommand)
export class CreateUserPostHandler {
  constructor(
    private readonly postRepository: IPostsRepository,
    private readonly userRepository: IUserRepository,
    private readonly imageService: ImageService,
  ) {}
  async execute(command: CreateUserPostCommand): Promise<void> {
    const { userId, content, visibility, images, taggedUserIds } = command
    let savedImages
    let post
    try {
      if (!userId || userId.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Data from client can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
            field: "userId",
          },
        })
      }
      if (!content || content.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Data from client can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
            field: "content",
          },
        })
      }
      if (!visibility) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Data from client can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
            field: "visibility",
          },
        })
      }
      if (!images) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Data from client can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
            field: "images",
          },
        })
      }
      if (!taggedUserIds) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Data from client can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
            field: "taggedUserIds",
          },
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
      console.log(taggedUserIds.length)
      if (taggedUserIds.length > 0) {
        await Promise.all(
          taggedUserIds.map(async (id) => {
            const taggedUser = await this.userRepository.findById(id)
            if (!taggedUser) {
              throw new CommandError({
                code: CommandErrorCode.BAD_REQUEST,
                message: "User not found",
                info: {
                  errorCode: CommandErrorDetailCode.USER_NOT_FOUND,
                },
              })
            }
          }),
        )
      }
      if (images.length > 0) {
        await this.imageService.uploadMultiImages(
          images,
          Folder.image.user_post,
          post.id,
          EImage.POST,
        )
      }
      await this.postRepository.createPost(post, taggedUserIds)
    } catch (err) {
      console.log(err)
      savedImages = await this.imageService.getImageByApplicableId(post.id)
      await Promise.all([
        this.imageService.removeMultipleImages(savedImages!),
        this.postRepository.deletePost(post),
      ])

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
