import { Mapper } from "@automapper/core"
import { InjectMapper } from "@automapper/nestjs"
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Response,
} from "@nestjs/common"
import { Request as ExpressRequest, Response as ExpressResponse } from "express"
import { DeleteUserCommand } from "../application/command/user/delete-user/delete-user.command"
import { UpdateBioCommand } from "../application/command/user/update-bio/update-bio.command"
import { UpdateUsernameCommand } from "../application/command/user/update-username/update-username.command"
import { GetAllUsersQuery } from "../application/query/user/get-all-user/get-all-user.query"
import { GetUserQuery } from "../application/query/user/get-user/get-user.query"
import { UserService } from "../application/user.service"
import { DeleteUserRequestDto } from "./http/dto/request/user/delete-user.request.dto"
import { GetAllUsersRequestDto } from "./http/dto/request/user/get-all-user.request.dto"
import { GetUserRequestDto } from "./http/dto/request/user/get-user.request.dto"
import { UpdateBioRequestDto } from "./http/dto/request/user/update-bio.request.dto"
import { UpdateUsernameRequestDto } from "./http/dto/request/user/update-username.request.dto"
import { GetAllUsersResponseDto } from "./http/dto/response/user/get-all-user.response.dto"
import { GetUserResponseDto } from "./http/dto/response/user/get-user.response.dto"

@Controller("users")
export class UserController {
  constructor(
    private readonly userService: UserService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}
  @Delete(":id")
  async deleteUser(@Param() param: DeleteUserRequestDto) {
    const command = this.mapper.map(
      param,
      DeleteUserRequestDto,
      DeleteUserCommand,
    )
    await this.userService.delete(command)
  }
  @Patch(":id")
  async updateBio(
    @Param() param: { id: string },
    @Body() body: UpdateBioRequestDto,
  ) {
    const command = this.mapper.map(body, UpdateBioRequestDto, UpdateBioCommand)
    command.id = param.id
    await this.userService.updateBio(command)
  }
  @Patch("username/:id")
  async updateUsername(
    @Param() param: { id: string },
    @Body() body: UpdateUsernameRequestDto,
  ) {
    const command = this.mapper.map(
      body,
      UpdateUsernameRequestDto,
      UpdateUsernameCommand,
    )
    command.id = param.id
    await this.userService.updateUsername(command)
  }
  @Get(":id")
  async getUser(
    @Param() param: GetUserRequestDto,
    @Response() response: ExpressResponse<GetUserResponseDto>,
  ) {
    const query = this.mapper.map(param, GetUserRequestDto, GetUserQuery)
    const result = await this.userService.getUser(query)
    response.send(result)
  }
  @Get("")
  async getAllUsers(
    @Query() param: GetAllUsersRequestDto,
    @Response() response: ExpressResponse<GetAllUsersResponseDto>,
  ) {
    const query = this.mapper.map(
      param,
      GetAllUsersRequestDto,
      GetAllUsersQuery,
    )
    const result = await this.userService.getAllUsers(query)
    response.send(result)
  }
}
