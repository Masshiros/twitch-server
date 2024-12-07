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
import { CommentCreateEvent } from "src/module/posts/domain/events/comment-create.event"
import { PostFactory } from "src/module/posts/domain/factory/posts.factory"
import { IPostsRepository } from "src/module/posts/domain/repository/posts.interface.repository"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { CreateCommentCommand } from "./create-comment.command"

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler {
  constructor(
    private readonly postRepository: IPostsRepository,
    private readonly userRepository: IUserRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async execute(command: CreateCommentCommand): Promise<void> {
    const { content, userId, postId, parentId } = command
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
      if (!postId || postId.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Post id can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
            field: "postId",
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
      const post = await this.postRepository.findPostById(postId)
      if (!post) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Post not found",
          info: {
            errorCode: CommandErrorDetailCode.USER_NOT_FOUND,
          },
        })
      }
      if (parentId) {
        const parentComment =
          await this.postRepository.findCommentById(parentId)
        if (!parentComment) {
          throw new CommandError({
            code: CommandErrorCode.BAD_REQUEST,
            message: "Comment to reply not found. Refresh",
            info: {
              errorCode: CommandErrorDetailCode.USER_NOT_FOUND,
            },
          })
        }
      }
      console.log(parentId)
      const comment = PostFactory.createComment({
        postId: post.id,
        userId: user.id,
        content: content,
        parentId: parentId,
      })

      if (!comment) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Cannot create comment. Try again",
          info: {
            errorCode: CommandErrorDetailCode.SOMETHING_WRONG_HAPPEN,
          },
        })
      }
      await this.postRepository.createComment(comment)
      this.eventEmitter.emit(
        Events.comment.create,
        new CommentCreateEvent(comment, parentId),
      )
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
