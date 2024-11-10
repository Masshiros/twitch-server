import { Controller, Param, Post } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { SuccessMessages } from "libs/constants/success"
import { SwaggerErrorMessages } from "libs/constants/swagger-error-messages"
import { ApiOperationDecorator } from "libs/decorator/api-operation.decorator"
import { CurrentUser } from "libs/decorator/current-user.decorator"
import { ResponseMessage } from "libs/decorator/response-message.decorator"
import { UserAggregate } from "src/module/users/domain/aggregate"
import { FollowCommand } from "../application/command/follow/follow.command"
import { UnfollowCommand } from "../application/command/unfollow/unfollow.command"
import { FollowerService } from "../application/follower.service"
import { GetListFollowersQuery } from "../application/query/get-list-followers/get-list-followers.query"
import { GetListFollowingsQuery } from "../application/query/get-list-followings/get-list-followings.query"
import { FollowRequestDto } from "./http/dto/request/follow.request.dto"
import { UnfollowRequestDto } from "./http/dto/request/unfollow.request.dto"
import { GetFollowerResponseDto } from "./http/dto/response/get-follower.response.dto"

@ApiTags("Follower")
@Controller("followers")
export class FollowerController {
  constructor(private readonly followerService: FollowerService) {}
  @ApiOperationDecorator({
    summary: "Follow a user",
    description: "User want to follow another user",
    listBadRequestErrorMessages:
      SwaggerErrorMessages.followers.follow.badRequest,
    listNotFoundErrorMessages: SwaggerErrorMessages.followers.follow.notFound,
    type: FollowRequestDto,
    auth: true,
  })
  @ResponseMessage(SuccessMessages.followers.FOLLOW_USER)
  @Post("/follow/:destinationUserId")
  async follow(
    @Param("destinationUserId") param: string,
    @CurrentUser() user: UserAggregate,
  ) {
    const command = new FollowCommand({
      sourceUserId: user.id,
      destinationUserId: param,
    })
    await this.followerService.follow(command)
  }
  @ApiOperationDecorator({
    summary: "Unfollow a user",
    description: "User want to unfollow another user",
    listBadRequestErrorMessages:
      SwaggerErrorMessages.followers.unfollow.badRequest,
    listNotFoundErrorMessages: SwaggerErrorMessages.followers.unfollow.notFound,
    type: UnfollowRequestDto,
    auth: true,
  })
  @ResponseMessage(SuccessMessages.followers.UNFOLLOW_USER)
  @Post("/un-follow/:destinationUserId")
  async unFollow(
    @Param("destinationUserId") param: string,
    @CurrentUser() user: UserAggregate,
  ) {
    const command = new UnfollowCommand({
      sourceUserId: user.id,
      destinationUserId: param,
    })
    await this.followerService.unfollow(command)
  }
  @ApiOperationDecorator({
    summary: "Get followers",
    description: "Get list followers of current user",
    listBadRequestErrorMessages:
      SwaggerErrorMessages.followers.getListFollowers.badRequest,
    listNotFoundErrorMessages:
      SwaggerErrorMessages.followers.getListFollowers.notFound,
    auth: true,
  })
  @ResponseMessage(SuccessMessages.followers.GET_LIST_FOLLOWERS)
  @Post("/list-followers")
  async getListFollowers(
    @CurrentUser() user: UserAggregate,
  ): Promise<GetFollowerResponseDto[] | null> {
    const query = new GetListFollowersQuery({ userId: user.id })
    return await this.followerService.getListFollowers(query)
  }
  @ApiOperationDecorator({
    summary: "Get following",
    description: "Get list following of current user",
    listBadRequestErrorMessages:
      SwaggerErrorMessages.followers.getListFollowings.badRequest,
    listNotFoundErrorMessages:
      SwaggerErrorMessages.followers.getListFollowings.notFound,
    auth: true,
  })
  @ResponseMessage(SuccessMessages.followers.GET_LIST_FOLLOWINGS)
  @Post("/list-following")
  async getListFollowing(
    @CurrentUser() user: UserAggregate,
  ): Promise<GetFollowerResponseDto[] | null> {
    const query = new GetListFollowingsQuery({ userId: user.id })
    return await this.followerService.getListFollowings(query)
  }
}
