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
} from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { plainToInstance } from "class-transformer"
import { Request as ExpressRequest, Response as ExpressResponse } from "express"
import { SuccessMessages } from "libs/constants/success"
import { ApiOperationDecorator } from "libs/decorator/api-operation.decorator"
import { ResponseMessage } from "libs/decorator/response-message.decorator"
import { ToggleTwoFaCommand } from "../application/command/auth/toggle-two-fa/toggle-two-fa.command"
import { DeleteUserCommand } from "../application/command/user/delete-user/delete-user.command"
import { ToggleActivateCommand } from "../application/command/user/toggle-activate/toggle-activate.command"
import { UpdateBioCommand } from "../application/command/user/update-bio/update-bio.command"
import { UpdateUsernameCommand } from "../application/command/user/update-username/update-username.command"
import { GetAllUsersQuery } from "../application/query/user/get-all-user/get-all-user.query"
import { GetUserQuery } from "../application/query/user/get-user/get-user.query"
import { UserService } from "../application/user.service"
import { DeleteUserRequestDto } from "./http/dto/request/user/delete-user.request.dto"
import { GetAllUsersRequestDto } from "./http/dto/request/user/get-all-user.request.dto"
import { GetUserRequestDto } from "./http/dto/request/user/get-user.request.dto"
import { ToggleActivateRequestDto } from "./http/dto/request/user/toggle-activate.request.dto"
import { ToggleTwoFaRequestDto } from "./http/dto/request/user/toggle-two-fa.request.dto"
import { UpdateBioRequestDto } from "./http/dto/request/user/update-bio.request.dto"
import { UpdateUsernameRequestDto } from "./http/dto/request/user/update-username.request.dto"
import { GetAllUsersResponseDto } from "./http/dto/response/user/get-all-user.response.dto"
import { GetUserResponseDto } from "./http/dto/response/user/get-user.response.dto"

@ApiTags("User")
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}
  @ApiOperationDecorator({
    type: null,
    summary: "Delete a user",
    description: "Delete a user",
  })
  @ResponseMessage(SuccessMessages.user.DELETE_USER)
  @Delete(":id")
  async deleteUser(@Param() param: DeleteUserRequestDto) {
    const command = new DeleteUserCommand(param)
    await this.userService.delete(command)
  }

  @ApiOperationDecorator({
    summary: "Update user bio",
    description: "Updates the bio and display name of the user",
    type: null,
  })
  @ResponseMessage(SuccessMessages.user.UPDATE_BIO)
  @Patch(":id")
  async updateBio(
    @Param() param: { id: string },
    @Body() body: UpdateBioRequestDto,
  ) {
    const command = new UpdateBioCommand(body)
    command.id = param.id
    await this.userService.updateBio(command)
  }

  // PATCH: Update Username
  @ApiOperationDecorator({
    summary: "Update username",
    description: "Updates the username of the user",
    type: null,
  })
  @ResponseMessage(SuccessMessages.user.UPDATE_USERNAME)
  @Patch("username/:id")
  async updateUsername(
    @Param() param: { id: string },
    @Body() body: UpdateUsernameRequestDto,
  ) {
    const command = new UpdateUsernameCommand(body)
    command.id = param.id
    await this.userService.updateUsername(command)
  }

  // GET: Get User by ID
  @ApiOperationDecorator({
    summary: "Get user by ID",
    description: "Fetches a user by the given ID",
    type: GetUserResponseDto,
  })
  @ResponseMessage(SuccessMessages.user.GET_ONE_USER)
  @Get(":id")
  async getUser(
    @Param() param: GetUserRequestDto,
    @Response() response: ExpressResponse<GetUserResponseDto | null>,
  ) {
    const query = new GetUserQuery(param)
    const user = await this.userService.getUser(query)
    const result = plainToInstance(GetUserResponseDto, user.result, {
      excludeExtraneousValues: true,
    })
    response.send(result)
  }

  // GET: Get All Users with Pagination
  @ApiOperationDecorator({
    summary: "Get all users",
    description: "Fetches a paginated list of users with optional filters",
    type: GetUserResponseDto,
  })
  @ResponseMessage(SuccessMessages.user.GET_ALL_USERS)
  @Get("")
  async getAllUsers(
    @Query() param: GetAllUsersRequestDto,
    @Response() response: ExpressResponse<GetAllUsersResponseDto | null>,
  ) {
    console.log(param)
    const query = new GetAllUsersQuery(param)
    const users = await this.userService.getAllUsers(query)
    if (!users.result) {
      return null
    }
    const result = users.result.map((user) =>
      plainToInstance(GetUserResponseDto, user, {
        excludeExtraneousValues: true,
      }),
    )

    response.send(result)
  }
  @ApiOperationDecorator({
    summary: "Toggle activate user",
    description: "Activate or deactivate user",
    type: ToggleActivateRequestDto,
  })
  @ResponseMessage(SuccessMessages.user.TOGGLE_ACTIVATE)
  @Post("toggle-activate")
  async toggleActivate(@Body() body: ToggleActivateRequestDto) {
    const command = new ToggleActivateCommand(body)
    await this.userService.toggleActivate(command)
  }
}
