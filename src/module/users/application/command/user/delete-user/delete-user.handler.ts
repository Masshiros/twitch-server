import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
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
    // currentUser: { id: string; username: string },
  ): Promise<any> {
    const { id: targetUserId } = command
    try {
      // validate current user's id equal the one need to delete's id
      if (!targetUserId || targetUserId.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "User id can not be empty",
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

      // TODO(role): Need to check who delete user later(ADMIN or USER)
      await this.userRepository.delete(targetUser.id)
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
