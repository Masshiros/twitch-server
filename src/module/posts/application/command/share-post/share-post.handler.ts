import { CommandHandler } from "@nestjs/cqrs"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { ESharedType } from "src/module/posts/domain/enum/shared-type.enum"
import { IPostsRepository } from "src/module/posts/domain/repository/posts.interface.repository"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { SharePostCommand } from "./share-post.command"

@CommandHandler(SharePostCommand)
export class SharePostHandler {
  constructor(
    private readonly postRepository: IPostsRepository,
    private readonly userRepository: IUserRepository,
  ) {}
  async execute(command: SharePostCommand) {
    const { postId, sharedById, sharedToId, shareToType, customContent } =
      command
    try {
      if (!postId || postId.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Post to share can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
            field: "postId",
          },
        })
      }
      if (!sharedById || sharedById.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Who share post's id can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
            field: "sharedById",
          },
        })
      }
      if (!sharedToId || sharedToId.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Where receive post's id can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
            field: "sharedToId",
          },
        })
      }
      if (!shareToType || shareToType.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Type of where to share can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
            field: "sharedToType",
          },
        })
      }
      const [shareBy, post] = await Promise.all([
        this.userRepository.findById(sharedById),
        this.postRepository.findPostById(postId),
      ])
      if (!shareBy) {
        throw new CommandError({
          code: CommandErrorCode.NOT_FOUND,
          message: "User share post not found",
          info: {
            errorCode: CommandErrorDetailCode.USER_NOT_FOUND,
          },
        })
      }
      if (!post) {
        throw new CommandError({
          code: CommandErrorCode.NOT_FOUND,
          message: "Post not found",
          info: {
            errorCode: CommandErrorDetailCode.NOT_FOUND,
          },
        })
      }
      const isShared = await this.postRepository.isSharedPost(post, shareBy)
      if (isShared) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "You already share this post",
          info: {
            errorCode: CommandErrorDetailCode.ALREADY_EXIST,
          },
        })
      }
      let shareTo
      switch (shareToType) {
        case ESharedType.USER:
          shareTo = await this.userRepository.findById(sharedToId)
          break
        case ESharedType.CHAT:
          // TODO(CHAT): When have private chat
          break
        case ESharedType.GROUP:
          // TODO(GROUP): When have group
          break
        default:
          break
      }
      await this.postRepository.sharePost(
        post,
        shareBy,
        shareTo,
        shareToType,
        customContent,
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
