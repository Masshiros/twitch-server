import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
import { DeleteUserPostCommand } from "../application/command/delete-user-post/delete-user-post.command"
import { EditUserPostCommand } from "../application/command/edit-user-post/edit-user-post.command"
import { ReactToPostCommand } from "../application/command/react-to-post/react-to-post.command"
import { ToggleHidePostsFromUserCommand } from "../application/command/toggle-hide-posts-from-user/toggle-hide-posts-from-user.command"
import { PostsService } from "../application/posts.service"
import { GetAllReactionsQuery } from "../application/query/get-all-reactions/get-all-reactions.query"
import { GetReactionsByTypeQuery } from "../application/query/get-reactions-by-type/get-reactions-by-type.query"
import { GetUserPostsQuery } from "../application/query/get-user-posts/get-user-posts.query"
import { CreateUserPostRequestDto } from "./dto/request/create-user-post.request.dto"
import { DeleteUserPostRequestDto } from "./dto/request/delete-user-post.request.dto"
import { EditUserPostRequestDto } from "./dto/request/edit-user-post.request.dto"
import { GetAllReactionsRequestDto } from "./dto/request/get-all-reactions.request.dto"
import { GetReactionsByTypeRequestDto } from "./dto/request/get-reactions-by-type.request.dto"
import { GetUserPostsRequestDto } from "./dto/request/get-user-posts.request.dto"
import { ReactToPostRequestDto } from "./dto/request/react-to-post.request.dto"
import { ToggleHidePostsFromUserRequestDto } from "./dto/request/toggle-hide-posts-from-user.request.dto"
import { GetAllReactionsResponseDto } from "./dto/response/get-all-reactions.response.dto"
import { GetReactionsByTypeResponseDto } from "./dto/response/get-reactions-by-type.response.dto"
import { GetUserPostsResponseDto } from "./dto/response/get-user-posts.response.dto"

@ApiTags("posts")
@Controller("posts")
export class PostsController {
  constructor(private readonly service: PostsService) {}
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
  async createUserPost(
    @Body() data: CreateUserPostRequestDto,
    @CurrentUser() user: UserAggregate,
    @UploadedFiles() images: Express.Multer.File[],
  ): Promise<void> {
    const command = new CreateUserPostCommand({
      ...data,
      images,
      userId: user.id,
    })
    console.log(data)

    await this.service.createUserPost(command)
  }
  // DELETE: delete user's post
  @ApiOperationDecorator({
    summary: "Delete post",
    description: "Current logged in user delete a post",
    auth: true,
  })
  @Permission([Permissions.Posts.Delete])
  @ResponseMessage(SuccessMessages.posts.DELETE_POST)
  @Delete("")
  async deleteUserPost(
    @Query() query: DeleteUserPostRequestDto,
    @CurrentUser() user: UserAggregate,
  ) {
    const command = new DeleteUserPostCommand({
      postId: query.postId,
      userId: user.id,
    })
    await this.service.deleteUserPost(command)
  }
  // PATCH: update user's post
  @ApiOperationDecorator({
    summary: "Update post",
    description: "Current logged in user update a post",
    auth: true,
    fileFieldName: "images",
  })
  @Permission([Permissions.Posts.Update])
  @ResponseMessage(SuccessMessages.posts.UPDATE_POST)
  @UseInterceptors(FilesInterceptor("images"))
  @Patch(":postId")
  async editUserPost(
    @Body() data: EditUserPostRequestDto,
    @UploadedFiles() images: Express.Multer.File[],
    @Param("postId") postId: string,
    @CurrentUser() user: UserAggregate,
  ) {
    const command = new EditUserPostCommand({
      ...data,
      images,
      postId,
      userId: user.id,
    })

    await this.service.editUserPost(command)
  }
  //POST: React to Post
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
  //Get: Get all post reactions
  @ApiOperationDecorator({
    summary: "Get all reactions",
    description: "Get all reactions of specific post",
    auth: true,
  })
  @Permission([Permissions.Reactions.Read])
  @ResponseMessage(SuccessMessages.posts.GET_ALL_REACTIONS)
  @Get("/:postId/reactions")
  async getAllReactions(
    @Param() param: GetAllReactionsRequestDto,
  ): Promise<GetAllReactionsResponseDto> {
    const query = new GetAllReactionsQuery(param)
    return await this.service.getAllReactions(query)
  }
  //Get: Get post's reactions by type
  @ApiOperationDecorator({
    summary: "Get post reactions by type",
    description: "Get post reactions by type ",
    type: GetReactionsByTypeResponseDto,
    auth: true,
  })
  @Permission([Permissions.Reactions.Read])
  @ResponseMessage(SuccessMessages.posts.GET_REACTIONS_BY_TYPE)
  @Get("/reactions")
  async getPostReactionsByType(
    @Query() data: GetReactionsByTypeRequestDto,
  ): Promise<GetReactionsByTypeResponseDto> {
    const query = new GetReactionsByTypeQuery(data)
    return await this.service.getReactionsByType(query)
  }
  //Get: Get user's posts
  @ApiOperationDecorator({
    summary: "Get user's post",
    description: "Get specific user's post",
    type: GetUserPostsResponseDto,
    auth: true,
  })
  @Permission([Permissions.Reactions.Read])
  @ResponseMessage(SuccessMessages.posts.GET_USER_POSTS)
  @Get("/:userId")
  async getUserPosts(
    @Param("userId") userId: string,
    @CurrentUser() currentUser: UserAggregate,
    @Query() data: GetUserPostsRequestDto,
  ): Promise<GetUserPostsResponseDto> {
    const query = new GetUserPostsQuery({
      ...data,
      userId: userId,
      currentUserId: currentUser.id,
    })
    query.limit = data.limit ?? 5
    query.offset = data.page ? (data.page - 1) * data.limit : null
    return await this.service.getUserPosts(query)
  }
  //Get: Get my posts
  @ApiOperationDecorator({
    summary: "Get my post",
    description: "Get current login user's post",
    type: GetUserPostsResponseDto,
    auth: true,
  })
  @Permission([Permissions.Reactions.Read])
  @ResponseMessage(SuccessMessages.posts.GET_MY_POSTS)
  @Get("/get/me")
  async getMyPosts(
    @CurrentUser() user: UserAggregate,
    @CurrentUser() currentUser: UserAggregate,
    @Query() data: GetUserPostsRequestDto,
  ): Promise<GetUserPostsResponseDto> {
    const query = new GetUserPostsQuery({
      ...data,
      userId: user.id,
      currentUserId: currentUser.id,
    })
    query.limit = data.limit ?? 5
    query.offset = data.page ? (data.page - 1) * data.limit : null
    return await this.service.getUserPosts(query)
  }

  // Post: Toggle hide posts from user
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
}
