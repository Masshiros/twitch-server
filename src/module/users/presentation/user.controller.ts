import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Response,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { ApiTags } from "@nestjs/swagger"
import { plainToInstance } from "class-transformer"
import { Request as ExpressRequest, Response as ExpressResponse } from "express"
import { Permissions } from "libs/constants/permissions"
import { SuccessMessages } from "libs/constants/success"
import { ApiOperationDecorator } from "libs/decorator/api-operation.decorator"
import { CurrentUser } from "libs/decorator/current-user.decorator"
import { Permission } from "libs/decorator/permission.decorator"
import { Public } from "libs/decorator/public.decorator"
import { ResponseMessage } from "libs/decorator/response-message.decorator"
import { FileValidationPipe } from "libs/pipe/image-validation.pipe"
import { AssignPermissionToRoleCommand } from "../application/command/role/assign-permission-to-role/assign-permission-to-role.command"
import { AssignRoleToUserCommand } from "../application/command/role/assign-role-to-user/assign-role-to-user.command"
import { AddProfilePictureCommand } from "../application/command/user/add-profile-picture/add-profile-picture.command"
import { DeleteUserCommand } from "../application/command/user/delete-user/delete-user.command"
import { ToggleActivateCommand } from "../application/command/user/toggle-activate/toggle-activate.command"
import { UpdateBioCommand } from "../application/command/user/update-bio/update-bio.command"
import { UpdateProfilePictureCommand } from "../application/command/user/update-profile-picture/update-profile-picture.command"
import { UpdateUsernameCommand } from "../application/command/user/update-username/update-username.command"
import { GetListDeviceQuery } from "../application/query/device/get-list-device/get-list-device.query"
import { GetListLoginHistoriesQuery } from "../application/query/login-history/get-list-login-histories/get-list-login-histories.query"
import { GetAllPermissionsQuery } from "../application/query/role/get-all-permissions/get-all-permissions.query"
import { GetAllRolesQuery } from "../application/query/role/get-all-role/get-all-role.query"
import { GetUserPermissionsQuery } from "../application/query/role/get-user-permissions/get-user-permissions.query"
import { GetUserRoleQuery } from "../application/query/role/get-user-role/get-user-role.query"
import { GetAllUsersQuery } from "../application/query/user/get-all-user/get-all-user.query"
import { GetUserQuery } from "../application/query/user/get-user/get-user.query"
import { UserService } from "../application/user.service"
import { UserAggregate } from "../domain/aggregate"
import { AssignPermissionsToRoleRequestDto } from "./http/dto/request/role/assign-permission-to-role.request.dto"
import { AssignRoleToUserRequestDto } from "./http/dto/request/role/assign-role-to-user.request.dto"
import { GetAllPermissionsRequestDto } from "./http/dto/request/role/get-all-permissions.request.dto"
import { GetAllRolesRequestDto } from "./http/dto/request/role/get-all-roles.request.dto"
import { GetUserPermissionsRequestDto } from "./http/dto/request/role/get-user-permissions.request.dto"
import { GetUserRolesRequestDto } from "./http/dto/request/role/get-user-roles.request.dto"
import { AddProfilePictureRequestDto } from "./http/dto/request/user/add-profile-picture.request.dto"
import { DeleteUserRequestDto } from "./http/dto/request/user/delete-user.request.dto"
import { GetAllUsersRequestDto } from "./http/dto/request/user/get-all-user.request.dto"
import { GetUserRequestDto } from "./http/dto/request/user/get-user.request.dto"
import { ToggleActivateRequestDto } from "./http/dto/request/user/toggle-activate.request.dto"
import { UpdateBioRequestDto } from "./http/dto/request/user/update-bio.request.dto"
import { UpdateProfilePictureRequestDto } from "./http/dto/request/user/update-profile-picture.request.dto"
import { UpdateUsernameRequestDto } from "./http/dto/request/user/update-username.request.dto"
import { PermissionResponseDto } from "./http/dto/response/role/permission.response.dto"
import { RoleResponseDto } from "./http/dto/response/role/role.response.dto"
import { GetAllUsersResponseDto } from "./http/dto/response/user/get-all-user.response.dto"
import { GetDeviceResponseDto } from "./http/dto/response/user/get-device.response.dto"
import { GetLoginHistoryResponseDto } from "./http/dto/response/user/get-login-history.response.dto"
import { GetUserResponseDto } from "./http/dto/response/user/get-user.response.dto"

@ApiTags("User")
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}
  @ApiOperationDecorator({
    type: null,
    summary: "Delete a user",
    description: "Delete a user",
    auth: true,
  })
  @Permission([Permissions.Users.Delete])
  @ResponseMessage(SuccessMessages.user.DELETE_USER)
  @Delete("/:id")
  async deleteUser(@Param() param: DeleteUserRequestDto) {
    const command = new DeleteUserCommand(param)
    await this.userService.delete(command)
  }

  @ApiOperationDecorator({
    summary: "Update user bio",
    description: "Updates the bio and display name of the user",
    type: null,
    auth: true,
  })
  @Permission([Permissions.Users.Update])
  @ResponseMessage(SuccessMessages.user.UPDATE_BIO)
  @Patch("/update-bio")
  async updateBio(
    @CurrentUser() user: UserAggregate,
    @Body() body: UpdateBioRequestDto,
  ) {
    const command = new UpdateBioCommand(body)
    command.id = user.id
    await this.userService.updateBio(command)
  }

  // PATCH: Update Username
  @ApiOperationDecorator({
    summary: "Update username",
    description: "Updates the username of the user",
    type: null,
    auth: true,
  })
  @Permission([Permissions.Users.Update])
  @ResponseMessage(SuccessMessages.user.UPDATE_USERNAME)
  @Patch("/update-username")
  async updateUsername(
    @CurrentUser() user: UserAggregate,
    @Body() body: UpdateUsernameRequestDto,
  ) {
    const command = new UpdateUsernameCommand(body)
    command.id = user.id
    await this.userService.updateUsername(command)
  }

  // POST: Add profile picture
  @ApiOperationDecorator({
    summary: "Add profile picture",
    description: "Add profile picture of the user",
    type: null,
    auth: true,
    fileFieldName: "picture",
  })
  @Permission([Permissions.Users.Update])
  @ResponseMessage(SuccessMessages.user.ADD_PROFILE_PICTURE)
  @UseInterceptors(FileInterceptor("picture"))
  @Post("profile-picture/add")
  async addProfilePicture(
    @Body() dto: AddProfilePictureRequestDto,
    @UploadedFile(new FileValidationPipe()) picture: Express.Multer.File,
    @CurrentUser() user: UserAggregate,
  ) {
    const command = new AddProfilePictureCommand({ userId: user.id, picture })
    await this.userService.addProfilePicture(command)
  }

  // PATCH: Update profile picture
  @ApiOperationDecorator({
    summary: "Update profile picture",
    description: "Update profile picture of the user",
    type: null,
    auth: true,
    fileFieldName: "picture",
  })
  @Permission([Permissions.Users.Update])
  @ResponseMessage(SuccessMessages.user.UPDATE_PROFILE_PICTURE)
  @UseInterceptors(FileInterceptor("picture"))
  @Patch("profile-picture/update")
  async updateProfilePicture(
    @Body() dto: UpdateProfilePictureRequestDto,
    @UploadedFile(new FileValidationPipe()) picture: Express.Multer.File,
    @CurrentUser() user: UserAggregate,
  ) {
    const command = new UpdateProfilePictureCommand({
      userId: user.id,
      picture,
    })
    await this.userService.updateProfilePicture(command)
  }

  // GET: Get User by ID
  @ApiOperationDecorator({
    summary: "Get user by ID",
    description: "Fetches a user by the given ID",
    type: GetUserResponseDto,
  })
  @ResponseMessage(SuccessMessages.user.GET_ONE_USER)
  @Public()
  @Get("/specific-user/:id")
  async getUser(
    @Param() param: GetUserRequestDto,
  ): Promise<GetUserResponseDto | null> {
    const query = new GetUserQuery(param)
    const user = await this.userService.getUser(query)
    const result = plainToInstance(GetUserResponseDto, user.result, {
      excludeExtraneousValues: true,
    })
    return result
  }

  // GET: Get All Users with Pagination
  @ApiOperationDecorator({
    summary: "Get all users",
    description: "Fetches a paginated list of users with optional filters",
    type: GetUserResponseDto,
  })
  @ResponseMessage(SuccessMessages.user.GET_ALL_USERS)
  @Public()
  @Get("/")
  async getAllUsers(
    @Query() param: GetAllUsersRequestDto,
  ): Promise<GetAllUsersResponseDto | null> {
    const query = new GetAllUsersQuery(param)
    query.limit = param.limit ?? 5
    query.offset = param.page ? (param.page - 1) * param.limit : null
    const users = await this.userService.getAllUsers(query)
    if (!users.result) {
      return null
    }
    const result = users.result.map((user) =>
      plainToInstance(GetUserResponseDto, user, {
        excludeExtraneousValues: true,
      }),
    )

    return result
  }

  @ApiOperationDecorator({
    summary: "Toggle activate user",
    description: "Activate or deactivate user",
    type: ToggleActivateRequestDto,
  })
  @Permission([Permissions.Users.Create])
  @ResponseMessage(SuccessMessages.user.TOGGLE_ACTIVATE)
  @Post("/toggle-activate")
  async toggleActivate(@Body() body: ToggleActivateRequestDto) {
    const command = new ToggleActivateCommand(body)
    await this.userService.toggleActivate(command)
  }

  @ApiOperationDecorator({
    summary: "Get list devices of user",
    description: "Get list devices user has logged in",
    auth: true,
  })
  @Permission([Permissions.Devices.Read])
  @ResponseMessage(SuccessMessages.user.GET_LIST_DEVICES)
  @Get("/list-devices")
  async getListDevices(
    @CurrentUser() user: UserAggregate,
  ): Promise<GetDeviceResponseDto[] | null> {
    const query = new GetListDeviceQuery({ userId: user.id })
    const devices = await this.userService.getListDevices(query)
    if (!devices) {
      return null
    }
    const result = devices.map((device) =>
      plainToInstance(GetDeviceResponseDto, device, {
        excludeExtraneousValues: true,
      }),
    )
    return result
  }

  @ApiOperationDecorator({
    summary: "Get list login histories of user",
    description: "Get list login histories user has logged in",
    auth: true,
  })
  @Permission([Permissions.LoginHistories.Read])
  @ResponseMessage(SuccessMessages.user.GET_LIST_HISTORIES)
  @Get("/list-login-histories")
  async getListLoginHistories(
    @CurrentUser() user: UserAggregate,
  ): Promise<GetLoginHistoryResponseDto[] | null> {
    const query = new GetListLoginHistoriesQuery({ userId: user.id })
    const histories = await this.userService.getListLoginHistories(query)
    if (!histories) {
      return null
    }
    const result = histories.map((history) =>
      plainToInstance(GetLoginHistoryResponseDto, history, {
        excludeExtraneousValues: true,
      }),
    )
    return result
  }

  @ApiOperationDecorator({
    summary: "Assign roles to user",
    description: "Assign roles to user in admin",
    auth: true,
  })
  // @Permission([])
  @Permission([Permissions.Roles.Update, Permissions.Users.Create])
  @ResponseMessage(SuccessMessages.roles.ASSIGN_ROLE_TO_USER)
  @Post("/role/assign-role-to-user")
  async assignRoleToUser(@Body() data: AssignRoleToUserRequestDto) {
    const command = new AssignRoleToUserCommand({
      userId: data.userId,
      roleId: data.roleId,
    })
    await this.userService.assignRoleToUser(command)
  }

  @ApiOperationDecorator({
    summary: "Assign permissions to user",
    description: "Assign permissions to user in admin",
    auth: true,
  })
  // @Permission([])
  @Permission([
    Permissions.Roles.Create,
    Permissions.Permissions.Create,
    Permissions.Roles.Update,
    Permissions.Permissions.Update,
  ])
  @ResponseMessage(SuccessMessages.roles.ASSIGN_PERMISSION_TO_ROLE)
  @Post("/role/assign-permissions-to-role")
  async assignPermissionsToRole(
    @Body() data: AssignPermissionsToRoleRequestDto,
  ) {
    const command = new AssignPermissionToRoleCommand({
      roleId: data.roleId,
      permissionsId: data.permissionsId,
    })
    await this.userService.assignPermissionToRole(command)
  }

  @ApiOperationDecorator({
    summary: "Get all role",
    description: "Get all roles existed in the system",
    auth: true,
  })
  // @Permission([])
  @Permission([Permissions.Roles.Read])
  @ResponseMessage(SuccessMessages.roles.GET_ALL_ROLES)
  @Get("/role")
  async getAllRoles(
    @Query() data: GetAllRolesRequestDto,
  ): Promise<RoleResponseDto[] | null> {
    const query = new GetAllRolesQuery(data)
    query.limit = data.limit ?? 5
    query.offset = data.page ? (data.page - 1) * data.limit : null
    return (await this.userService.getAllRoles(query)) ?? null
  }

  @ApiOperationDecorator({
    summary: "Get user's role",
    description: "Get all roles of specific user",
    auth: true,
  })
  // @Permission([])
  @Permission([Permissions.Roles.Read])
  @ResponseMessage(SuccessMessages.roles.GET_USER_ROLES)
  @Get("/role/user/:userId")
  async getUserRoles(
    @Param() param: GetUserRolesRequestDto,
  ): Promise<RoleResponseDto[] | null> {
    const query = new GetUserRoleQuery(param)
    return (await this.userService.getUserRoles(query)) ?? null
  }

  @ApiOperationDecorator({
    summary: "Get all permission",
    description: "Get all permissions existed in the system",
    auth: true,
  })
  // @Permission([])
  @Permission([Permissions.Permissions.Read])
  @ResponseMessage(SuccessMessages.roles.GET_ALL_PERMISSIONS)
  @Get("/permission")
  async getAllPermissions(
    @Query() data: GetAllPermissionsRequestDto,
  ): Promise<PermissionResponseDto[] | null> {
    const query = new GetAllPermissionsQuery(data)
    query.limit = data.limit ?? 5
    query.offset = data.page ? (data.page - 1) * data.limit : null
    return (await this.userService.getAllPermissions(query)) ?? null
  }

  @ApiOperationDecorator({
    summary: "Get user's permission",
    description: "Get all permissions of specific user",
    auth: true,
  })
  // @Permission([])
  @Permission([Permissions.Permissions.Read])
  @ResponseMessage(SuccessMessages.roles.GET_USER_PERMISSIONS)
  @Get("/permission/user/:userId")
  async getUserPermissions(
    @Param() param: GetUserPermissionsRequestDto,
  ): Promise<PermissionResponseDto[] | null> {
    const query = new GetUserPermissionsQuery(param)
    return (await this.userService.getUserPermissions(query)) ?? null
  }
}
