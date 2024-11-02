import { Body, Controller, Post, Response } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { Permissions } from "libs/constants/permissions"
import { SuccessMessages } from "libs/constants/success"
import { ApiOperationDecorator } from "libs/decorator/api-operation.decorator"
import { CurrentUser } from "libs/decorator/current-user.decorator"
import { Permission } from "libs/decorator/permission.decorator"
import { ResponseMessage } from "libs/decorator/response-message.decorator"
import { UserAggregate } from "src/module/users/domain/aggregate"
import { ReactToPostCommand } from "../application/command/react-to-post/react-to-post.command"
import { ToggleHidePostsFromUserCommand } from "../application/command/toggle-hide-posts-from-user/toggle-hide-posts-from-user.command"
import { PostsService } from "../application/posts.service"
import { ReactToPostRequestDto } from "./dto/request/react-to-post.request.dto"
import { ToggleHidePostsFromUserRequestDto } from "./dto/request/toggle-hide-posts-from-user.request.dto"

@ApiTags("posts")
@Controller("posts")
export class PostsController {
  constructor(private readonly service: PostsService) {}
  @ApiOperationDecorator({
    summary: "React to post",
    description: "React to a specific post",
  })
  @Permission([Permissions.Reactions.Create, Permissions.Reactions.Update])
  @ResponseMessage(SuccessMessages.posts.REACT_TO_POST)
  @Post("react-to-post")
  async reactToPost(
    @Body() data: ReactToPostRequestDto,
    @CurrentUser() user: UserAggregate,
  ): Promise<void> {
    const command = new ReactToPostCommand({ ...data, userId: user.id })
    await this.service.reactToPost(command)
  }

  @ApiOperationDecorator({
    summary: "(Toggle) hide posts from user",
    description:
      "All posts of this user will be hidden or unhidden from new feed of current user",
  })
  @Post("hide-post-from-user")
  async toggleHidePostFromUser(
    @Body() data: ToggleHidePostsFromUserRequestDto,
    @CurrentUser() user: UserAggregate,
  ): Promise<void> {
    const command = new ToggleHidePostsFromUserCommand({
      ...data,
      userId: user.id,
    })
    await this.service.toggleHidePostFromUser(command)
  }
}
