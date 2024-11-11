import { Body, Controller, Post } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { Permissions } from "libs/constants/permissions"
import { SuccessMessages } from "libs/constants/success"
import { SwaggerErrorMessages } from "libs/constants/swagger-error-messages"
import { ApiOperationDecorator } from "libs/decorator/api-operation.decorator"
import { CurrentUser } from "libs/decorator/current-user.decorator"
import { Permission } from "libs/decorator/permission.decorator"
import { ResponseMessage } from "libs/decorator/response-message.decorator"
import { UserAggregate } from "src/module/users/domain/aggregate"
import { CreateGroupCommand } from "../application/command/create-group/create-group.command"
import { GroupsService } from "../application/groups.service"
import { CreateGroupRequestDto } from "./http/dto/request/create-group.request.dto"

@ApiTags("groups")
@Controller("groups")
export class GroupsController {
  constructor(private readonly service: GroupsService) {}
  @ApiOperationDecorator({
    summary: "Create a group",
    description: "Current logged in user create a new group",
    listBadRequestErrorMessages:
      SwaggerErrorMessages.groups.createGroup.badRequest,
    listNotFoundErrorMessages: SwaggerErrorMessages.groups.createGroup.notFound,
    auth: true,
  })
  @Permission([Permissions.Groups.Create])
  @ResponseMessage(SuccessMessages.groups.CREATE_GROUP)
  @Post()
  async createGroup(
    @Body() data: CreateGroupRequestDto,
    @CurrentUser() user: UserAggregate,
  ): Promise<void> {
    // console.log(data)
    const command = new CreateGroupCommand({
      ...data,
      ownerId: user.id,
    })
    // console.log(command)
    await this.service.createGroup(command)
  }
}
