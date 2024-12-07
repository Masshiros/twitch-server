import { CommandHandler } from "@nestjs/cqrs"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { Events } from "libs/constants/events"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { ImageService } from "src/module/image/application/image.service"
import { PostDeleteEvent } from "src/module/posts/domain/events/post-delete.event"
import { IPostsRepository } from "src/module/posts/domain/repository/posts.interface.repository"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { DeleteUserPostCommand } from "./delete-user-post.command"

@CommandHandler(DeleteUserPostCommand)
export class DeleteUserPostHandler {
  constructor(
    private readonly postRepository: IPostsRepository,
    private readonly userRepository: IUserRepository,
    private readonly imageService: ImageService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async execute(command: DeleteUserPostCommand): Promise<void> {
    const { userId, postId } = command
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
          message: "Post to delete's id can not be empty",
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
      console.log(postId)
      const post = await this.postRepository.findPostById(postId)
      if (!post) {
        throw new CommandError({
          code: CommandErrorCode.NOT_FOUND,
          message: "Post not found",
          info: {
            errorCode: CommandErrorDetailCode.NOT_FOUND,
          },
        })
      }
      if (user.id !== post.userId) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "This post is not belong to you",
          info: {
            errorCode: CommandErrorDetailCode.UNAUTHORIZED,
          },
        })
      }
      const images = await this.imageService.getImageByApplicableId(post.id)
      if (images && images.length > 0) {
        await this.imageService.removeMultipleImages(images)
      }
      await Promise.all([
        this.postRepository.deletePost(post),
        this.eventEmitter.emit(Events.post.delete, new PostDeleteEvent(post)),
      ])
    } catch (err) {
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
