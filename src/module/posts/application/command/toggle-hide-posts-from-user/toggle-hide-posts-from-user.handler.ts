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
import { ToggleHidePostsFromUserCommand } from "./toggle-hide-posts-from-user.command"

@CommandHandler(ToggleHidePostsFromUserCommand)
export class ToggleHidePostsFromUserHandler {
  constructor(
    private readonly postRepository: IPostsRepository,
    private readonly userRepository: IUserRepository,
  ) {}
  async execute(command: ToggleHidePostsFromUserCommand) {
    const { userId, hiddenUserId } = command
    try {
      if (!userId) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Data from client can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
          },
        })
      }
      if (!hiddenUserId) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Data from client can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
          },
        })
      }
      const user = await this.userRepository.findById(userId!)
      if (!user) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "User not found",
          info: {
            errorCode: CommandErrorDetailCode.USER_NOT_FOUND,
          },
        })
      }
      const hiddenUser = await this.userRepository.findById(userId!)
      if (!hiddenUser) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "User to hidden not found",
          info: {
            errorCode: CommandErrorDetailCode.USER_NOT_FOUND,
          },
        })
      }
      const isUserHidden = await this.postRepository.isUserHidden(
        user,
        hiddenUser,
      )
      if (!isUserHidden) {
        return await this.postRepository.hidePostsFromUser(
          user.id,
          hiddenUser.id,
        )
      }
      return await this.postRepository.unhidePostsFromUser(
        user.id,
        hiddenUser.id,
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
