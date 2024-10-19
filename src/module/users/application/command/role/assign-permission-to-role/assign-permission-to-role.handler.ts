import { CommandHandler } from "@nestjs/cqrs"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { AssignPermissionToRoleCommand } from "./assign-permission-to-role.command"

@CommandHandler(AssignPermissionToRoleCommand)
export class AssignPermissionToRoleHandler {
  constructor(private readonly userRepository: IUserRepository) {}
  async execute(command: AssignPermissionToRoleCommand) {
    const { roleId, permissionsId } = command
    try {
      if (!roleId || roleId.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Data from client can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
          },
        })
      }
      const role = await this.userRepository.getRoleById(roleId)
      if (!role) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Role not found",
          info: {
            errorCode: CommandErrorDetailCode.NOT_FOUND,
          },
        })
      }
      const rolePermissions = await Promise.all(
        permissionsId.map(async (e) => {
          const permission = await this.userRepository.getPermissionById(e)
          if (!permission) {
            throw new CommandError({
              code: CommandErrorCode.BAD_REQUEST,
              message: "Permission not found",
              info: {
                errorCode: CommandErrorDetailCode.NOT_FOUND,
              },
            })
          }
          return permission
        }),
      )
      await Promise.all(
        rolePermissions.map((permission) =>
          this.userRepository.assignPermissionToRole(role, permission),
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
