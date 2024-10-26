import { Controller, Param, Post } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { SuccessMessages } from "libs/constants/success"
import { ApiOperationDecorator } from "libs/decorator/api-operation.decorator"
import { CurrentUser } from "libs/decorator/current-user.decorator"
import { ResponseMessage } from "libs/decorator/response-message.decorator"
import { UserAggregate } from "src/module/users/domain/aggregate"
import { MarkAsReadCommand } from "../application/command/mark-as-read/mark-as-read.command"
import { NotificationsService } from "../application/notifications.service"
import { MarkAsReadRequestDto } from "./http/dto/request/mark-as-read.request.dto"

@ApiTags("notifications")
@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationService: NotificationsService) {}
  @ApiOperationDecorator({
    summary: "Mark as read",
    description: "Mark notification as read",
    type: MarkAsReadRequestDto,
    auth: true,
  })
  @ResponseMessage(SuccessMessages.notifications.MARK_AS_READ)
  @Post("/:notificationId")
  async markAsRead(
    @Param("") param: MarkAsReadRequestDto,
    @CurrentUser() user: UserAggregate,
  ) {
    const command = new MarkAsReadCommand({
      notificationId: param.notificationId,
      userId: user.id,
    })
    await this.notificationService.markAsRead(command)
  }
}
