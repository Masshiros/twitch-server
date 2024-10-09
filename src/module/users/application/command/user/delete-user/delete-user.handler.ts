import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { UserAggregate } from "src/module/users/domain/aggregate"
import { UserFactory } from "src/module/users/domain/factory/user"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { DeleteUserCommand } from "./delete-user.command"

@CommandHandler(DeleteUserCommand)
export class DeleteUserCommandHandler {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userFactory: UserFactory,
  ) {}
  async execute(
    command: DeleteUserCommand,
    currentUser: { id: string; username: string },
  ): Promise<any> {
    // validate current user's id equal the one need to delete's id
    const { id: targetUserId } = command
    if (targetUserId !== currentUser.id) {
      throw new CommandError({
        code: CommandErrorCode.BAD_REQUEST,
        message: "Unauthorized to delete user",
        info: {
          errorCode: CommandErrorDetailCode.UNAUTHORIZED,
        },
      })
    }
    // validate delete user is exist
    const targetUser: UserAggregate | null =
      await this.userRepository.findById(targetUserId)
    if (!targetUser) {
      throw new CommandError({
        code: CommandErrorCode.NOT_FOUND,
        message: "User not found",
        info: {
          errorCode: CommandErrorDetailCode.USER_NOT_FOUND,
        },
      })
    }
    // validate current user is exist
    const currentUserAggregate: UserAggregate | null =
      await this.userRepository.findByUsername(currentUser.username)
    if (!currentUserAggregate || currentUserAggregate.id !== currentUser.id) {
      throw new CommandError({
        code: CommandErrorCode.BAD_REQUEST,
        message: "Unauthorized",
        info: {
          errorCode: CommandErrorDetailCode.UNAUTHORIZED,
        },
      })
    }
    // TODO(role): Need to check who delete user later(ADMIN or USER)
    await this.userRepository.delete(targetUser.id)
  }
}
