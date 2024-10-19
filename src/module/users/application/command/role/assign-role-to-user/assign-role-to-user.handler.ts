import { CommandHandler } from "@nestjs/cqrs"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { AssignRoleToUserCommand } from "./assign-role-to-user.command"

@CommandHandler(AssignRoleToUserCommand)
export class AssignRoleToUserHandler {
  constructor(private readonly userRepository: IUserRepository) {}
  async execute(command: AssignRoleToUserCommand) {
    const { userId, roleId } = command
    try {
      if (!userId || userId.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Data from client can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
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
      const userRole = await Promise.all(
        roleId.map(async (e) => {
          const role = await this.userRepository.getRoleById(e)
          if (!role) {
            throw new CommandError({
              code: CommandErrorCode.BAD_REQUEST,
              message: "Role not found",
              info: {
                errorCode: CommandErrorDetailCode.NOT_FOUND,
              },
            })
          }
          return role
        }),
      )
      user.roles = userRole
      await Promise.all(
        user.roles.map((role) =>
          this.userRepository.assignRoleToUser(role, user),
        ),
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
