import { Body, Controller, Get, Post } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { Permissions } from "libs/constants/permissions"
import { SuccessMessages } from "libs/constants/success"
import { ApiOperationDecorator } from "libs/decorator/api-operation.decorator"
import { CurrentUser } from "libs/decorator/current-user.decorator"
import { Permission } from "libs/decorator/permission.decorator"
import { ResponseMessage } from "libs/decorator/response-message.decorator"
import { UserAggregate } from "src/module/users/domain/aggregate"
import { AcceptFriendRequestCommand } from "../application/command/accept-friend-request/accept-friend-request.command"
import { RejectFriendRequestCommand } from "../application/command/reject-friend-request/reject-friend-request.command"
import { SendFriendRequestCommand } from "../application/command/send-friend-request/send-friend-request.command"
import { FriendService } from "../application/friend.service"
import { GetListFriendRequestQuery } from "../application/query/get-list-friend-requests/get-list-friend-requests.query"
import { AcceptFriendRequestRequestDto } from "./dto/request/accept-friend-request.request.dto"
import { RejectFriendRequestRequestDto } from "./dto/request/reject-friend-request.request.dto"
import { SendFriendRequestRequestDto } from "./dto/request/send-friend-request.request.dto"
import { GetListFriendRequestsResponseDto } from "./dto/response/get-list-friend-requests.response.dto"

@ApiTags("Friend")
@Controller("friends")
export class FriendController {
  constructor(private readonly service: FriendService) {}
  // POST:send friend request
  @ApiOperationDecorator({
    summary: "Send friend request to user",
    description: "Current user send friend request to another user",
    auth: true,
  })
  @ResponseMessage(SuccessMessages.friend.SEND_FRIEND_REQUEST)
  // @Permission([Permissions.FriendRequests.Create])
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
  // POST: Accept Friend Request
  @ApiOperationDecorator({
    summary: "Accept friend request to user",
    description: "Current user accept friend request from another user",
    auth: true,
  })
  @ResponseMessage(SuccessMessages.friend.ACCEPT_FRIEND_REQUEST)
  // @Permission([
  //   Permissions.FriendRequests.Create,
  //   Permissions.FriendRequests.Read,
  // ])
  @Post("/accept")
  async acceptFriendRequest(
    @Body() data: AcceptFriendRequestRequestDto,
    @CurrentUser() user: UserAggregate,
  ) {
    const command = new AcceptFriendRequestCommand({
      senderId: data.senderId,
      receiverId: user.id,
    })
    await this.service.acceptFriendRequest(command)
  }
  // POST: Accept Friend Request
  @ApiOperationDecorator({
    summary: "Reject friend request to user",
    description: "Current user reject friend request from another user",
    auth: true,
  })
  @ResponseMessage(SuccessMessages.friend.REJECT_FRIEND_REQUEST)
  // @Permission([
  //   Permissions.FriendRequests.Create,
  //   Permissions.FriendRequests.Read,
  // ])
  @Post("/reject")
  async rejectFriendRequest(
    @Body() data: RejectFriendRequestRequestDto,
    @CurrentUser() user: UserAggregate,
  ) {
    const command = new RejectFriendRequestCommand({
      senderId: data.senderId,
      receiverId: user.id,
    })
    await this.service.rejectFriendRequest(command)
  }
  //GET: Get List Friend Requests
  @ApiOperationDecorator({
    summary: "Get list friend requests ",
    description: "Current user get list friend requests ",
    auth: true,
  })
  @ResponseMessage(SuccessMessages.friend.GET_LIST_FRIEND_REQUESTS)
  @Get("/friend-requests")
  async getListFriendRequests(
    @CurrentUser() user: UserAggregate,
  ): Promise<GetListFriendRequestsResponseDto> {
    const query = new GetListFriendRequestQuery({ receiverId: user.id })
    return await this.service.getListFriendRequests(query)
  }
}
