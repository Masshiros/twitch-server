import { Body, Controller, Post } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { SuccessMessages } from "libs/constants/success"
import { ApiOperationDecorator } from "libs/decorator/api-operation.decorator"
import { CurrentUser } from "libs/decorator/current-user.decorator"
import { ResponseMessage } from "libs/decorator/response-message.decorator"
import { UserAggregate } from "src/module/users/domain/aggregate"
import { SendFriendRequestCommand } from "../application/command/send-friend-request.command"
import { FriendService } from "../application/friend.service"
import { SendFriendRequestRequestDto } from "./dto/request/send-friend-request.request.dto"

@ApiTags("Friend")
@Controller("friends")
export class FriendController {
  constructor(private readonly service: FriendService) {}
  @ApiOperationDecorator({
    summary: "Send friend request to user",
    description: "Current user send friend request to another user",
    auth: true,
  })
  @ResponseMessage(SuccessMessages.friend.SEND_FRIEND_REQUEST)
  @Post("/send-request")
  async sendFriendRequest(
    @Body() data: SendFriendRequestRequestDto,
    @CurrentUser() user: UserAggregate,
  ) {
    const command = new SendFriendRequestCommand({
      senderId: user.id,
      receiverId: data.receiverId,
    })
    await this.service.sendFriendRequest(command)
  }
}
