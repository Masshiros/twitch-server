import { Injectable } from "@nestjs/common"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { ConfirmEmailCommand } from "./command/auth/confirm-email/confirm-email.command"
import { ToggleTwoFaCommand } from "./command/auth/toggle-two-fa/toggle-two-fa.command"
import { AssignPermissionToRoleCommand } from "./command/role/assign-permission-to-role/assign-permission-to-role.command"
import { AssignRoleToUserCommand } from "./command/role/assign-role-to-user/assign-role-to-user.command"
import { DeleteUserCommand } from "./command/user/delete-user/delete-user.command"
import { ToggleActivateCommand } from "./command/user/toggle-activate/toggle-activate.command"
import { UpdateBioCommand } from "./command/user/update-bio/update-bio.command"
import { UpdateUsernameCommand } from "./command/user/update-username/update-username.command"
import { GetListDeviceQuery } from "./query/device/get-list-device/get-list-device.query"
import { GetListLoginHistoriesQuery } from "./query/login-history/get-list-login-histories/get-list-login-histories.query"
import { GetAllRolesQuery } from "./query/role/get-all-role/get-all-role.query"
import { GetUserRoleQuery } from "./query/role/get-user-role/get-user-role.query"
import { GetAllUsersQuery } from "./query/user/get-all-user/get-all-user.query"
import { GetUserQuery } from "./query/user/get-user/get-user.query"

@Injectable()
export class UserService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  delete(deleteUserCommand: DeleteUserCommand) {
    return this.commandBus.execute(deleteUserCommand)
  }
  updateBio(updateBioCommand: UpdateBioCommand) {
    return this.commandBus.execute(updateBioCommand)
  }
  updateUsername(updateUsernameCommand: UpdateUsernameCommand) {
    return this.commandBus.execute(updateUsernameCommand)
  }
  getUser(getUserQuery: GetUserQuery) {
    return this.queryBus.execute(getUserQuery)
  }
  getAllUsers(getAllUsersQuery: GetAllUsersQuery) {
    return this.queryBus.execute(getAllUsersQuery)
  }
  toggleActivate(command: ToggleActivateCommand) {
    return this.commandBus.execute(command)
  }
  getListDevices(query: GetListDeviceQuery) {
    return this.queryBus.execute(query)
  }
  getListLoginHistories(query: GetListLoginHistoriesQuery) {
    return this.queryBus.execute(query)
  }
  assignRoleToUser(command: AssignRoleToUserCommand) {
    return this.commandBus.execute(command)
  }
  assignPermissionToRole(command: AssignPermissionToRoleCommand) {
    return this.commandBus.execute(command)
  }
  getAllRoles(query: GetAllRolesQuery) {
    return this.queryBus.execute(query)
  }
  getUserRoles(query: GetUserRoleQuery) {
    return this.queryBus.execute(query)
  }
}
