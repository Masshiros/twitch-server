import { Injectable } from "@nestjs/common"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { CreateLivestreamSessionCommand } from "./command/livestream/create-livestream-session/create-livestream-session.command"
import { SetIsLiveCommand } from "./command/livestream/set-is-live/set-is-live.command"
import { SetStreamInfoCommand } from "./command/livestream/set-stream-info/set-stream-info.command"
import { SetViewCommand } from "./command/livestream/set-view/set-view.command"
import { UpdateLivestreamSessionCommand } from "./command/livestream/update-livestream-session/update-livestream-session.command"
import { AssignPermissionToRoleCommand } from "./command/role/assign-permission-to-role/assign-permission-to-role.command"
import { AssignRoleToUserCommand } from "./command/role/assign-role-to-user/assign-role-to-user.command"
import { AddProfilePictureCommand } from "./command/user/add-profile-picture/add-profile-picture.command"
import { AddThumbnailCommand } from "./command/user/add-thumbnail/add-thumbnail.command"
import { DeleteUserCommand } from "./command/user/delete-user/delete-user.command"
import { SetStreamKeyCommand } from "./command/user/set-stream-key/set-stream-key.command"
import { ToggleActivateCommand } from "./command/user/toggle-activate/toggle-activate.command"
import { UpdateBioCommand } from "./command/user/update-bio/update-bio.command"
import { UpdateDisplayNameCommand } from "./command/user/update-display-name/update-display-name.command"
import { UpdateProfilePictureCommand } from "./command/user/update-profile-picture/update-profile-picture.command"
import { UpdateUsernameCommand } from "./command/user/update-username/update-username.command"
import { GetListDeviceQuery } from "./query/device/get-list-device/get-list-device.query"
import { GetListLoginHistoriesQuery } from "./query/login-history/get-list-login-histories/get-list-login-histories.query"
import { GetAllPermissionsQuery } from "./query/role/get-all-permissions/get-all-permissions.query"
import { GetAllRolesQuery } from "./query/role/get-all-role/get-all-role.query"
import { GetUserPermissionsQuery } from "./query/role/get-user-permissions/get-user-permissions.query"
import { GetUserRoleQuery } from "./query/role/get-user-role/get-user-role.query"
import { GetAllStreamQuery } from "./query/user/get-all-stream/get-all-stream.query"
import { GetAllUsersQuery } from "./query/user/get-all-user/get-all-user.query"
import { GetLivestreamInfoQuery } from "./query/user/get-livestream-info/get-livestream-info.query"
import { GetStreamKeyQuery } from "./query/user/get-stream-key/get-stream-key.query"
import { GetTop5StreamQuery } from "./query/user/get-top-5-stream/get-top-5-stream.query"
import { GetUserByUserNameQuery } from "./query/user/get-user-by-username/get-user-by-username.query"
import { GetUserQuery } from "./query/user/get-user/get-user.query"
import { IsValidUserNameQuery } from "./query/user/is-valid-username/is-valid-username.query"

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
  updateDisplayname(command: UpdateDisplayNameCommand) {
    return this.commandBus.execute(command)
  }
  addProfilePicture(command: AddProfilePictureCommand) {
    return this.commandBus.execute(command)
  }
  addThumbnail(command: AddThumbnailCommand) {
    return this.commandBus.execute(command)
  }
  updateProfilePicture(command: UpdateProfilePictureCommand) {
    return this.commandBus.execute(command)
  }
  getUser(getUserQuery: GetUserQuery) {
    return this.queryBus.execute(getUserQuery)
  }
  getUserByUsername(query: GetUserByUserNameQuery) {
    return this.queryBus.execute(query)
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
  getAllPermissions(query: GetAllPermissionsQuery) {
    return this.queryBus.execute(query)
  }
  getUserPermissions(query: GetUserPermissionsQuery) {
    return this.queryBus.execute(query)
  }
  isValidUserName(query: IsValidUserNameQuery) {
    return this.queryBus.execute(query)
  }
  setStreamKey(command: SetStreamKeyCommand) {
    return this.commandBus.execute(command)
  }
  setStreamInfo(command: SetStreamInfoCommand) {
    return this.commandBus.execute(command)
  }
  setIsLive(command: SetIsLiveCommand) {
    return this.commandBus.execute(command)
  }
  getStreamKey(query: GetStreamKeyQuery) {
    return this.queryBus.execute(query)
  }
  getAllLivingStreamInfo(query: GetAllStreamQuery) {
    return this.queryBus.execute(query)
  }
  getTop5Stream(query: GetTop5StreamQuery) {
    return this.queryBus.execute(query)
  }
  updateLivestreamSession(command: UpdateLivestreamSessionCommand) {
    return this.commandBus.execute(command)
  }
  getLiveStreamInfo(query: GetLivestreamInfoQuery) {
    return this.queryBus.execute(query)
  }
  createLiveStreamSession(command: CreateLivestreamSessionCommand) {
    return this.commandBus.execute(command)
  }
  setView(command: SetViewCommand) {
    return this.commandBus.execute(command)
  }
}
