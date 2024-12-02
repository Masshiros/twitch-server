import { InjectQueue } from "@nestjs/bullmq"
import { CommandHandler } from "@nestjs/cqrs"
import { Queue } from "bullmq"
import { Bull } from "libs/constants/bull"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { IPostsRepository } from "src/module/posts/domain/repository/posts.interface.repository"
import { ViewPostCommand } from "./view-post.command"

@CommandHandler(ViewPostCommand)
export class ViewPostHandler {
  constructor(
    private readonly postRepository: IPostsRepository,
    @InjectQueue(Bull.queue.user_post.post_view)
    private readonly postViewQueue: Queue,
  ) {}
  async execute(command: ViewPostCommand) {
    const { postId } = command
    try {
      if (!postId || postId.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "PostId can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
            field: "postId",
          },
        })
      }
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
      this.postViewQueue.add(Bull.job.user_post.post_view, { postId })
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
