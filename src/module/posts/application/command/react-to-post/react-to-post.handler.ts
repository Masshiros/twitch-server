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
import { ENotification } from "src/module/notifications/domain/enum/notification.enum"
import { NotificationEmittedEvent } from "src/module/notifications/domain/events/notification-emitted.events"
import { NotificationFactory } from "src/module/notifications/domain/factory/notification.factory"
import { INotificationRepository } from "src/module/notifications/domain/repositories/notification.interface.repository"
import { PostFactory } from "src/module/posts/domain/factory/posts.factory"
import { IPostsRepository } from "src/module/posts/domain/repository/posts.interface.repository"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { ReactToPostCommand } from "./react-to-post.command"

@CommandHandler(ReactToPostCommand)
export class ReactToPostHandler {
  constructor(
    private readonly postRepository: IPostsRepository,
    private readonly emitter: EventEmitter2,
    private readonly userRepository: IUserRepository,
    private readonly notificationRepository: INotificationRepository,
  ) {}
  async execute(command: ReactToPostCommand) {
    const { userId, postId, reactionType } = command
    try {
      if (!userId) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "User id can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
          },
        })
      }
      if (!postId) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Post to react's id can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
          },
        })
      }
      if (!reactionType) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Reaction type can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
          },
        })
      }
      const user = await this.userRepository.findById(userId!)
      if (!user) {
        throw new CommandError({
          code: CommandErrorCode.NOT_FOUND,
          message: "User not found",
          info: {
            errorCode: CommandErrorDetailCode.USER_NOT_FOUND,
          },
        })
      }
      const post = await this.postRepository.findPostById(postId!)
      if (!post) {
        throw new CommandError({
          code: CommandErrorCode.NOT_FOUND,
          message: "Post not found",
          info: {
            errorCode: CommandErrorDetailCode.NOT_FOUND,
          },
        })
      }
      const reaction = PostFactory.createCreation({
        postId,
        userId,
        type: reactionType,
      })
      // TODO(group): will be here when finish groupPost
      if (!reaction) {
        throw new CommandError({
          code: CommandErrorCode.INTERNAL_SERVER_ERROR,
          message: "Something wrong happen. Try again later",
          info: {
            errorCode: CommandErrorDetailCode.SOMETHING_WRONG_HAPPEN,
          },
        })
      }
      await this.postRepository.addOrUpdateReactionToPost(reaction)
      // TODO(notify): Add notify here
      const notification = NotificationFactory.create({
        senderId: userId,
        title: `React to your post `,
        message: `${user.name} has react to your post.Reaction type: ${reactionType}`,
        type: ENotification.USER,
        createdAt: new Date(),
      })
      await this.notificationRepository.addNotification(notification)
      this.emitter.emit(
        Events.notification,
        new NotificationEmittedEvent([post.userId], notification),
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
