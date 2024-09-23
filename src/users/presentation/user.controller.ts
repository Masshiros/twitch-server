import { Mapper } from "@automapper/core"
import { InjectMapper } from "@automapper/nestjs"
import { Body, Controller, Delete, Param, Patch } from "@nestjs/common"
import { DeleteUserCommand } from "../application/command/user/delete-user/delete-user.command"
import { UpdateBioCommand } from "../application/command/user/update-bio/update-bio.command"
import { UpdateUsernameCommand } from "../application/command/user/update-username/update-username.command"
import { UserService } from "../application/user.service"
import { DeleteUserRequestDto } from "./http/dto/request/user/delete-user.request.dto"
import { UpdateBioRequestDto } from "./http/dto/request/user/update-bio.request.dto"
import { UpdateUsernameRequestDto } from "./http/dto/request/user/update-username.request.dto"

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
}
