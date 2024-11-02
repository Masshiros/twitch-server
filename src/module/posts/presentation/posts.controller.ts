import { Body, Controller, Post, Response } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { SuccessMessages } from "libs/constants/success"
import { ApiOperationDecorator } from "libs/decorator/api-operation.decorator"
import { CurrentUser } from "libs/decorator/current-user.decorator"
import { ResponseMessage } from "libs/decorator/response-message.decorator"
import { UserAggregate } from "src/module/users/domain/aggregate"
import { ReactToPostCommand } from "../application/command/react-to-post/react-to-post.command"
import { PostsService } from "../application/posts.service"
import { ReactToPostRequestDto } from "./dto/request/react-to-post.request.dto"

@ApiTags("posts")
@Controller("posts")
export class PostsController {
  constructor(private readonly service: PostsService) {}
  @ApiOperationDecorator({
    summary: "React to post",
    description: "React to a specific post",
  })
  @ResponseMessage(SuccessMessages.posts.REACT_TO_POST)
  @Post("react-to-post")
  async reactToPost(
    @Body() data: ReactToPostRequestDto,
    @CurrentUser() user: UserAggregate,
  ): Promise<void> {
    const command = new ReactToPostCommand({ ...data, userId: user.id })
    await this.service.reactToPost(command)
  }
}
