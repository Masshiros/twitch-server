import { Mapper } from "@automapper/core"
import { InjectMapper } from "@automapper/nestjs"
import { Body, Controller, Delete, Param, Patch } from "@nestjs/common"
import { DeleteUserCommand } from "../application/command/user/delete-user/delete-user.command"
import { UpdateBioCommand } from "../application/command/user/update-bio/update-bio.command"
import { UserService } from "../application/user.service"
import { DeleteUserDto } from "./http/dto/request/user/delete-user.dto"
import { UpdateBioDto } from "./http/dto/request/user/update-bio.dto"

@Controller("users")
export class UserController {
  constructor(
    private readonly userService: UserService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}
  @Delete(":id")
  async deleteUser(@Param() param: DeleteUserDto) {
    const command = this.mapper.map(param, DeleteUserDto, DeleteUserCommand)
    await this.userService.delete(command)
  }
  @Patch(":id")
  async UpdateBio(@Param() param: { id: string }, @Body() body: UpdateBioDto) {
    const command = this.mapper.map(body, UpdateBioDto, UpdateBioCommand)
    command.id = param.id
    await this.userService.updateBio(command)
  }
}
