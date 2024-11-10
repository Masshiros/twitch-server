import { CommandHandler } from "@nestjs/cqrs"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { Permission } from "src/module/users/domain/entity/permissions.entity"
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
          message: "Role id can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
          },
        })
      }
      const role = await this.userRepository.getRoleById(roleId)
      if (!role) {
        throw new CommandError({
          code: CommandErrorCode.NOT_FOUND,
          message: "Role not found",
          info: {
            errorCode: CommandErrorDetailCode.NOT_FOUND,
          },
        })
      }
      const existingPermissions =
        await this.userRepository.getRolePermissions(role)

      const rolePermissions: Permission[] = []
      for (const e of permissionsId) {
        const permission = await this.userRepository.getPermissionById(e)
        if (!permission) {
          throw new CommandError({
            code: CommandErrorCode.NOT_FOUND,
            message: "Permission not found",
            info: {
              errorCode: CommandErrorDetailCode.NOT_FOUND,
            },
          })
        }
        if (!existingPermissions.find((r) => r.id === permission.id)) {
          rolePermissions.push(permission)
        }
      }
      const permissionToRemove = existingPermissions.filter(
        (e) => !permissionsId.includes(e.id),
      )
      for (const permission of permissionToRemove) {
        await this.userRepository.removePermissionFromRole(role, permission)
      }
      for (const permission of rolePermissions) {
        await this.userRepository.assignPermissionToRole(role, permission)
      }
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
