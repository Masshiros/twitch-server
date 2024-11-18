import { Body, Controller, Param, Patch } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { Permissions } from "libs/constants/permissions"
import { SuccessMessages } from "libs/constants/success"
import { SwaggerErrorMessages } from "libs/constants/swagger-error-messages"
import { ApiOperationDecorator } from "libs/decorator/api-operation.decorator"
import { CurrentUser } from "libs/decorator/current-user.decorator"
import { Permission } from "libs/decorator/permission.decorator"
import { ResponseMessage } from "libs/decorator/response-message.decorator"
import { SetStreamInfoCommand } from "../application/command/livestream/set-stream-info/set-stream-info.command"
import { UserService } from "../application/user.service"
import { UserAggregate } from "../domain/aggregate"
import { SetStreamInfoRequestDto } from "./http/dto/request/livestream/set-stream-info.request.dto"

@ApiTags("Livestreams")
@Controller("livestreams")
export class LiveStreamController {
  constructor(private readonly userService: UserService) {}
  @ApiOperationDecorator({
    type: null,
    summary: "Set stream info",
    description: "Set stream info",
    listBadRequestErrorMessages:
      SwaggerErrorMessages.stream.setStreamTitle.badRequest,
    listNotFoundErrorMessages:
      SwaggerErrorMessages.stream.setStreamTitle.notFound,
    auth: true,
  })
  @Permission([
    Permissions.LiveStreams.Create,
    Permissions.LiveStreams.Update,
    Permissions.LiveStreams.Read,
    Permissions.LiveStreams.Delete,
  ])
  @ResponseMessage(SuccessMessages.livestream.SET_STREAM_TITLE)
  @Patch("/set-info")
  async setTitle(
    @Body() data: SetStreamInfoRequestDto,
    @CurrentUser() user: UserAggregate,
  ) {
    console.log(data)
    const command = new SetStreamInfoCommand({ ...data, userId: user.id })
    await this.userService.setStreamInfo(command)
  }
}
