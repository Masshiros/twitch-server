import { CommandHandler } from "@nestjs/cqrs"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { IPostsRepository } from "src/module/posts/domain/repository/posts.interface.repository"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { UpdateCommentCommand } from "./update-comment.command"

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentHandler {
  constructor(
    private readonly postRepository: IPostsRepository,
    private readonly userRepository: IUserRepository,
  ) {}
  async execute(command: UpdateCommentCommand): Promise<void> {
    const { userId, content, commentId } = command
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

      const comment = await this.postRepository.findCommentById(commentId)
      if (!comment) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Comment not found",
          info: {
            errorCode: CommandErrorDetailCode.USER_NOT_FOUND,
          },
        })
      }
      comment.content = content
      await this.postRepository.updateComment(comment)
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
