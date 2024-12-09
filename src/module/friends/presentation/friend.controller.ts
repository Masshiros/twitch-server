import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { Permissions } from "libs/constants/permissions"
import { SuccessMessages } from "libs/constants/success"
import { SwaggerErrorMessages } from "libs/constants/swagger-error-messages"
import { ApiOperationDecorator } from "libs/decorator/api-operation.decorator"
import { CurrentUser } from "libs/decorator/current-user.decorator"
import { Permission } from "libs/decorator/permission.decorator"
import { ResponseMessage } from "libs/decorator/response-message.decorator"
import { UserAggregate } from "src/module/users/domain/aggregate"
import { AcceptFriendRequestCommand } from "../application/command/accept-friend-request/accept-friend-request.command"
import { RejectFriendRequestCommand } from "../application/command/reject-friend-request/reject-friend-request.command"
import { RemoveFriendCommand } from "../application/command/remove-friend/remove-friend.command"
import { SendFriendRequestCommand } from "../application/command/send-friend-request/send-friend-request.command"
import { FriendService } from "../application/friend.service"
import { GetListFriendRequestQuery } from "../application/query/get-list-friend-requests/get-list-friend-requests.query"
import { GetListFriendQuery } from "../application/query/get-list-friend/get-list-friend.query"
import { GetMutualFriendsQuery } from "../application/query/get-mutual-friend/get-mutual-friends.query"
import { IsFriendQuery } from "../application/query/is-friend/is-friend.query"
import { AcceptFriendRequestRequestDto } from "./dto/request/accept-friend-request.request.dto"
import { GetListFriendsRequestDto } from "./dto/request/get-list-friends.request.dto"
import { GetMutualFriendsRequestDto } from "./dto/request/get-mutual-friends.request.dto"
import { RejectFriendRequestRequestDto } from "./dto/request/reject-friend-request.request.dto"
import { RemoveFriendRequestDto } from "./dto/request/remove-friend.request.dto"
import { SendFriendRequestRequestDto } from "./dto/request/send-friend-request.request.dto"
import { GetListFriendRequestsResponseDto } from "./dto/response/get-list-friend-requests.response.dto"
import { GetListFriendResponseDto } from "./dto/response/get-list-friend.response.dto"
import { GetMutualFriendResponseDto } from "./dto/response/get-mutual-friends.response.dto"

@ApiTags("Friend")
@Controller("friends")
export class FriendController {
  constructor(private readonly service: FriendService) {}
  // POST:send friend request
  @ApiOperationDecorator({
    summary: "Send friend request to user",
    description: "Current user send friend request to another user",
    listBadRequestErrorMessages:
      SwaggerErrorMessages.friends.sendFriendRequest.badRequest,
    listNotFoundErrorMessages:
      SwaggerErrorMessages.friends.sendFriendRequest.notFound,
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
    listBadRequestErrorMessages:
      SwaggerErrorMessages.friends.acceptFriendRequest.badRequest,
    listNotFoundErrorMessages:
      SwaggerErrorMessages.friends.acceptFriendRequest.notFound,
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
    listBadRequestErrorMessages:
      SwaggerErrorMessages.friends.rejectFriendRequest.badRequest,
    listNotFoundErrorMessages:
      SwaggerErrorMessages.friends.rejectFriendRequest.notFound,
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
  @ApiOperationDecorator({
    summary: "Return friend status",
    description: "Return friend status between 2 user",
    auth: true,
  })
  @ResponseMessage(SuccessMessages.friend.IS_FRIEND)
  @Get("/is-friend/:username")
  async isFriend(
    @CurrentUser() user: UserAggregate,
    @Param("username") username: string,
  ): Promise<string> {
    const query = new IsFriendQuery({ userId: user.id, friendName: username })
    return await this.service.isFriend(query)
  }
  //GET: Get List Friend Requests
  @ApiOperationDecorator({
    summary: "Get list friend requests ",
    description: "Current user get list friend requests ",
    listBadRequestErrorMessages:
      SwaggerErrorMessages.friends.getListFriendRequest.badRequest,
    listNotFoundErrorMessages:
      SwaggerErrorMessages.friends.getListFriendRequest.notFound,
    auth: true,
  })
  @ResponseMessage(SuccessMessages.friend.GET_LIST_FRIEND_REQUESTS)
  // @Permission([Permissions.FriendRequests.Read])
  @Get("/friend-requests")
  async getListFriendRequests(
    @CurrentUser() user: UserAggregate,
  ): Promise<GetListFriendRequestsResponseDto> {
    const query = new GetListFriendRequestQuery({ receiverId: user.id })
    return await this.service.getListFriendRequests(query)
  }
  //GET: Get List Friends
  @ApiOperationDecorator({
    summary: "Get list friend",
    description: "Current user get list friends of other user ",
    listBadRequestErrorMessages:
      SwaggerErrorMessages.friends.getListFriend.badRequest,
    listNotFoundErrorMessages:
      SwaggerErrorMessages.friends.getListFriend.notFound,
    auth: true,
  })
  @ResponseMessage(SuccessMessages.friend.GET_LIST_FRIENDS)
  // @Permission([Permissions.FriendRequests.Read])
  @Get("")
  async getListFriend(
    @Query() data: GetListFriendsRequestDto,
    @CurrentUser() user: UserAggregate,
  ): Promise<GetListFriendResponseDto> {
    const query = new GetListFriendQuery({
      userId: data.userId,
      currentUserId: user.id,
    })
    return await this.service.getListFriends(query)
  }
  //GET: Get My List Friends
  @ApiOperationDecorator({
    summary: "Get My List Friend",
    description: "Current user get his/her list friends",
    listBadRequestErrorMessages:
      SwaggerErrorMessages.friends.getListFriend.badRequest,
    listNotFoundErrorMessages:
      SwaggerErrorMessages.friends.getListFriend.notFound,
    auth: true,
  })
  @ResponseMessage(SuccessMessages.friend.GET_LIST_FRIENDS)
  // @Permission([Permissions.FriendRequests.Read])
  @Get("/my-list-friend")
  async getMyListFriend(
    @CurrentUser() user: UserAggregate,
  ): Promise<GetListFriendResponseDto> {
    const query = new GetListFriendQuery({
      userId: user.id,
      currentUserId: user.id,
    })
    return await this.service.getListFriends(query)
  }
  //GET: Get Friend's Mutual friends
  @ApiOperationDecorator({
    summary: "Get mutual friends",
    description: "Current user get mutual friends with other user",
    listBadRequestErrorMessages:
      SwaggerErrorMessages.friends.getMutualFriends.badRequest,
    listNotFoundErrorMessages:
      SwaggerErrorMessages.friends.getMutualFriends.notFound,
    auth: true,
  })
  @ResponseMessage(SuccessMessages.friend.GET_MUTUAL_FRIENDS)
  // @Permission([Permissions.FriendRequests.Read])
  @Get("/:userId/mutual-friends")
  async getMutualFriends(
    @Param() data: GetMutualFriendsRequestDto,
    @CurrentUser() user: UserAggregate,
  ): Promise<GetMutualFriendResponseDto> {
    const query = new GetMutualFriendsQuery({
      userId: data.userId,
      currentUserId: user.id,
    })
    return await this.service.getMutualFriends(query)
  }
  // DELETE: Remove friend
  @ApiOperationDecorator({
    summary: "Remove friend ",
    description: "Current user want to remove friend ",
    listBadRequestErrorMessages:
      SwaggerErrorMessages.friends.removeFriend.badRequest,
    listNotFoundErrorMessages:
      SwaggerErrorMessages.friends.removeFriend.notFound,
    auth: true,
  })
  @ResponseMessage(SuccessMessages.friend.REMOVE_FRIEND)
  // @Permission([Permissions.Friends.Delete])
  @Delete()
  async removeFriends(
    @CurrentUser() user: UserAggregate,
    @Param("friendId") data: string,
  ) {
    const command = new RemoveFriendCommand({
      userId: user.id,
      friendId: data,
    })
    await this.service.removeFriend(command)
  }
}
