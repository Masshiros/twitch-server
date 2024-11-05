import {
  Body,
  Controller,
  Post,
  Response,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common"
import { FilesInterceptor } from "@nestjs/platform-express"
import { ApiTags } from "@nestjs/swagger"
import { Permissions } from "libs/constants/permissions"
import { SuccessMessages } from "libs/constants/success"
import { ApiOperationDecorator } from "libs/decorator/api-operation.decorator"
import { CurrentUser } from "libs/decorator/current-user.decorator"
import { Permission } from "libs/decorator/permission.decorator"
import { ResponseMessage } from "libs/decorator/response-message.decorator"
import { UserAggregate } from "src/module/users/domain/aggregate"
import { CreateUserPostCommand } from "../application/command/create-user-post/create-user-post.command"
import { ReactToPostCommand } from "../application/command/react-to-post/react-to-post.command"
import { ToggleHidePostsFromUserCommand } from "../application/command/toggle-hide-posts-from-user/toggle-hide-posts-from-user.command"
import { PostsService } from "../application/posts.service"
import { CreatePostRequestDto } from "./dto/request/create-post.request.dto"
import { ReactToPostRequestDto } from "./dto/request/react-to-post.request.dto"
import { ToggleHidePostsFromUserRequestDto } from "./dto/request/toggle-hide-posts-from-user.request.dto"

@ApiTags("posts")
@Controller("posts")
export class PostsController {
  constructor(private readonly service: PostsService) {}
  @ApiOperationDecorator({
    summary: "React to post",
    description: "React to a specific post",
    auth: true,
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
    auth: true,
  })
  @Permission([Permissions.Posts.Create, Permissions.Posts.Update])
  @ResponseMessage(SuccessMessages.posts.REACT_TO_POST)
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
  // POST: Create a post
  @ApiOperationDecorator({
    summary: "Create a post",
    description: "Create a post for current logged in user",
    auth: true,
    fileFieldName: "images",
  })
  @Permission([Permissions.Posts.Create])
  @ResponseMessage(SuccessMessages.posts.CREATE_POST)
  @UseInterceptors(FilesInterceptor("images"))
  @Post()
  async createPost(
    @Body() data: CreatePostRequestDto,
    @CurrentUser() user: UserAggregate,
    @UploadedFiles() images: Express.Multer.File[],
  ): Promise<void> {
    const command = new CreateUserPostCommand({
      ...data,
      images,
      userId: user.id,
    })
    console.log(data)

    await this.service.createPost(command)
  }
}
