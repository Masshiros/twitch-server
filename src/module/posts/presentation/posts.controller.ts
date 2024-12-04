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
import { SwaggerErrorMessages } from "libs/constants/swagger-error-messages"
import { ApiOperationDecorator } from "libs/decorator/api-operation.decorator"
import { CurrentUser } from "libs/decorator/current-user.decorator"
import { Permission } from "libs/decorator/permission.decorator"
import { Public } from "libs/decorator/public.decorator"
import { ResponseMessage } from "libs/decorator/response-message.decorator"
import { UserAggregate } from "src/module/users/domain/aggregate"
import { CreateCommentCommand } from "../application/command/create-comment/create-comment.command"
import { CreateScheduleUserPostCommand } from "../application/command/create-schedule-user-post/create-schedule-user-post.command"
import { CreateUserPostCommand } from "../application/command/create-user-post/create-user-post.command"
import { DeleteUserPostCommand } from "../application/command/delete-user-post/delete-user-post.command"
import { EditUserPostCommand } from "../application/command/edit-user-post/edit-user-post.command"
import { ReactToPostCommand } from "../application/command/react-to-post/react-to-post.command"
import { SharePostCommand } from "../application/command/share-post/share-post.command"
import { ToggleHidePostsFromUserCommand } from "../application/command/toggle-hide-posts-from-user/toggle-hide-posts-from-user.command"
import { UpdateCommentCommand } from "../application/command/update-comment/update-comment.command"
import { ViewPostCommand } from "../application/command/view-post/view-post.command"
import { PostsService } from "../application/posts.service"
import { GetAllReactionsQuery } from "../application/query/get-all-reactions/get-all-reactions.query"
import { GetPostCommentQuery } from "../application/query/get-post-comment/get-post-comment.query"
import { GetPostQuery } from "../application/query/get-post/get-post.query"
import { GetReactionsByTypeQuery } from "../application/query/get-reactions-by-type/get-reactions-by-type.query"
import { GetUserFeedQuery } from "../application/query/get-user-feed/get-user-feed.query"
import { GetUserPostsQuery } from "../application/query/get-user-posts/get-user-posts.query"
import { SearchPostQuery } from "../application/query/search-post/search-post.query"
import { CreateCommentRequestDTO } from "./dto/request/create-comment.request.dto"
import { CreateScheduledUserPostRequestDto } from "./dto/request/create-schedule-user-post.request.dto"
import { CreateUserPostRequestDto } from "./dto/request/create-user-post.request.dto"
import { DeleteUserPostRequestDto } from "./dto/request/delete-user-post.request.dto"
import { EditUserPostRequestDto } from "./dto/request/edit-user-post.request.dto"
import { GetAllReactionsRequestDto } from "./dto/request/get-all-reactions.request.dto"
import { GetPostCommentRequestDto } from "./dto/request/get-post-comment.request.dto"
import { GetPostRequestDto } from "./dto/request/get-post-request.dto"
import { GetReactionsByTypeRequestDto } from "./dto/request/get-reactions-by-type.request.dto"
import { GetUserFeedRequestDto } from "./dto/request/get-user-feed.request.dto"
import { GetUserPostsRequestDto } from "./dto/request/get-user-posts.request.dto"
import { ReactToPostRequestDto } from "./dto/request/react-to-post.request.dto"
import { SearchPostRequestDto } from "./dto/request/search-post.request.dto"
import { SharePostToMeRequestDto } from "./dto/request/share-post-to-me.request.dto"
import { SharePostToOtherRequestDto } from "./dto/request/share-post.request.dto"
import { ToggleHidePostsFromUserRequestDto } from "./dto/request/toggle-hide-posts-from-user.request.dto"
import { UpdateCommentRequestDTO } from "./dto/request/update-comment.request.dto"
import { ViewPostRequestDto } from "./dto/request/view-post.request.dto"
import { GetAllReactionsResponseDto } from "./dto/response/get-all-reactions.response.dto"
import { GetReactionsByTypeResponseDto } from "./dto/response/get-reactions-by-type.response.dto"
import { GetUserPostsResponseDto } from "./dto/response/get-user-posts.response.dto"
import { SearchPostsResponseDto } from "./dto/response/search-posts.response.dto"

@ApiTags("posts")
@Controller("posts")
export class PostsController {
  constructor(private readonly service: PostsService) {}
  // POST: Create a post
  @ApiOperationDecorator({
    summary: "Create a post",
    description: "Create a post for current logged in user",
    listBadRequestErrorMessages:
      SwaggerErrorMessages.posts.createUserPost.badRequest,
    listNotFoundErrorMessages:
      SwaggerErrorMessages.posts.createUserPost.notFound,
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
    console.log(command)

    await this.service.createUserPost(command)
  }
  // DELETE: delete user's post
  @ApiOperationDecorator({
    summary: "Delete post",
    description: "Current logged in user delete a post",
    listBadRequestErrorMessages:
      SwaggerErrorMessages.posts.deleteUserPost.badRequest,
    listNotFoundErrorMessages:
      SwaggerErrorMessages.posts.deleteUserPost.notFound,
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
    listBadRequestErrorMessages:
      SwaggerErrorMessages.posts.editUserPost.badRequest,
    listNotFoundErrorMessages: SwaggerErrorMessages.posts.editUserPost.notFound,
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
    listBadRequestErrorMessages:
      SwaggerErrorMessages.posts.reactToPost.badRequest,
    listNotFoundErrorMessages: SwaggerErrorMessages.posts.reactToPost.notFound,
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
  //POST: View Post
  @ApiOperationDecorator({
    summary: "View post",
    description: "view post",
    auth: true,
  })
  @Permission([Permissions.Reactions.Read])
  @ResponseMessage(SuccessMessages.posts.VIEW_POST)
  @Patch("view-post/:postId")
  async viewPost(
    @Param() data: ViewPostRequestDto,
    @CurrentUser() user: UserAggregate,
  ): Promise<void> {
    const command = new ViewPostCommand({ ...data })
    await this.service.viewPost(command)
  }
  //POST: get Post details
  @ApiOperationDecorator({
    summary: "get post details",
    description: "get post details",
    auth: true,
  })
  @Permission([Permissions.Reactions.Read])
  @ResponseMessage(SuccessMessages.posts.GET_POST)
  @Get("details/:postId")
  async getPost(
    @Param() data: GetPostRequestDto,
    @CurrentUser() user: UserAggregate,
  ): Promise<void> {
    const query = new GetPostQuery({ ...data, userId: user.id })

    return await this.service.getPost(query)
  }
  //POST: Share Post to others
  @ApiOperationDecorator({
    summary: "Share post",
    description: "Share a specific post",
    listBadRequestErrorMessages:
      SwaggerErrorMessages.posts.sharePost.badRequest,
    listNotFoundErrorMessages: SwaggerErrorMessages.posts.sharePost.notFound,
    auth: true,
  })
  @Permission([Permissions.Posts.Create, Permissions.Posts.Update])
  @ResponseMessage(SuccessMessages.posts.SHARE_POST)
  @Post("share-post")
  async sharePost(
    @Body() data: SharePostToOtherRequestDto,
    @CurrentUser() user: UserAggregate,
  ): Promise<void> {
    const command = new SharePostCommand({ ...data, sharedById: user.id })
    await this.service.sharePost(command)
  }
  //POST: Share Post to me
  @ApiOperationDecorator({
    summary: "Share post to my page",
    description: "Share a specific post to my page",
    listBadRequestErrorMessages:
      SwaggerErrorMessages.posts.sharePost.badRequest,
    listNotFoundErrorMessages: SwaggerErrorMessages.posts.sharePost.notFound,
    auth: true,
  })
  @Permission([Permissions.Posts.Create, Permissions.Posts.Update])
  @ResponseMessage(SuccessMessages.posts.SHARE_POST)
  @Post("share-post/me")
  async sharePostToMe(
    @Body() data: SharePostToMeRequestDto,
    @CurrentUser() user: UserAggregate,
  ): Promise<void> {
    const command = new SharePostCommand({
      ...data,
      sharedById: user.id,
      sharedToId: user.id,
    })
    await this.service.sharePost(command)
  }
  //Get: Get all post reactions
  @ApiOperationDecorator({
    summary: "Get all reactions",
    description: "Get all reactions of specific post",
    listBadRequestErrorMessages:
      SwaggerErrorMessages.posts.getAllReactions.badRequest,
    listNotFoundErrorMessages:
      SwaggerErrorMessages.posts.getAllReactions.notFound,
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
    listBadRequestErrorMessages:
      SwaggerErrorMessages.posts.getReactionsByType.badRequest,
    listNotFoundErrorMessages:
      SwaggerErrorMessages.posts.getReactionsByType.notFound,
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
    listBadRequestErrorMessages:
      SwaggerErrorMessages.posts.getUserPosts.badRequest,
    listNotFoundErrorMessages: SwaggerErrorMessages.posts.getUserPosts.notFound,
    type: GetUserPostsResponseDto,
    // auth: true,
  })
  @Public()
  @ResponseMessage(SuccessMessages.posts.GET_USER_POSTS)
  @Get("/:username")
  async getUserPosts(
    @Param("username") username: string,
    // @CurrentUser() currentUser: UserAggregate,
    @Query() data: GetUserPostsRequestDto,
  ): Promise<GetUserPostsResponseDto> {
    const query = new GetUserPostsQuery({
      ...data,
      username: username,
      // currentUserId: currentUser.id,
    })
    query.limit = data.limit ?? 5
    query.offset = data.page ? (data.page - 1) * data.limit : null
    return await this.service.getUserPosts(query)
  }
  //Get: Search post by keyword
  @ApiOperationDecorator({
    summary: "Search post by keyword",
    description: "Search post by keyword",
    listBadRequestErrorMessages:
      SwaggerErrorMessages.posts.searchPost.badRequest,
    type: SearchPostsResponseDto,
    auth: true,
  })
  @Permission([Permissions.Posts.Read])
  @ResponseMessage(SuccessMessages.posts.SEARCH_POST)
  @Get("/search/:keyword")
  async searchPostsByKeyword(
    @CurrentUser() currentUser: UserAggregate,
    @Query() data: SearchPostRequestDto,
  ): Promise<SearchPostsResponseDto> {
    const query = new SearchPostQuery({ ...data })
    return await this.service.searchPost(query)
  }
  //Get: Get my posts
  @ApiOperationDecorator({
    summary: "Get my post",
    description: "Get current login user's post",
    listBadRequestErrorMessages:
      SwaggerErrorMessages.posts.getUserPosts.badRequest,
    listNotFoundErrorMessages: SwaggerErrorMessages.posts.getUserPosts.notFound,
    type: GetUserPostsResponseDto,
    auth: true,
  })
  @Permission([Permissions.Posts.Read])
  @ResponseMessage(SuccessMessages.posts.GET_MY_POSTS)
  @Get("/get/me")
  async getMyPosts(
    @CurrentUser() user: UserAggregate,
    @CurrentUser() currentUser: UserAggregate,
    @Query() data: GetUserPostsRequestDto,
  ): Promise<GetUserPostsResponseDto> {
    const query = new GetUserPostsQuery({
      ...data,
      username: user.name,
      currentUserId: currentUser.id,
    })
    query.limit = data.limit ?? 5
    query.offset = data.page ? (data.page - 1) * data.limit : null
    return await this.service.getUserPosts(query)
  }
  //Get: Get my feed
  @ApiOperationDecorator({
    summary: "Get my feed",
    description: "Get current login user's feed",
    listBadRequestErrorMessages:
      SwaggerErrorMessages.posts.getUserFeed.badRequest,
    listNotFoundErrorMessages: SwaggerErrorMessages.posts.getUserFeed.notFound,
    type: GetUserPostsResponseDto,
    auth: true,
  })
  @Permission([Permissions.Posts.Read])
  @ResponseMessage(SuccessMessages.posts.GET_MY_FEED)
  @Get("/get/my-feed")
  async getMyFeed(
    @Query() data: GetUserFeedRequestDto,
    @CurrentUser() user: UserAggregate,
  ): Promise<GetUserPostsResponseDto> {
    const query = new GetUserFeedQuery({ userId: user.id })

    query.limit = data.limit ?? 5
    query.offset = data.page ? (data.page - 1) * data.limit : null
    return await this.service.getUserFeed(query)
  }

  // Post: Toggle hide posts from user
  @ApiOperationDecorator({
    summary: "(Toggle) hide posts from user",
    description:
      "All posts of this user will be hidden or unhidden from new feed of current user",
    listBadRequestErrorMessages:
      SwaggerErrorMessages.posts.toggleHidePostsFromUser.badRequest,
    listNotFoundErrorMessages:
      SwaggerErrorMessages.posts.toggleHidePostsFromUser.notFound,
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
  // get: post comments
  @ApiOperationDecorator({
    summary: "Get all post comments",
    description: "Get all comments of a post",
    listBadRequestErrorMessages:
      SwaggerErrorMessages.posts.getPostComments.badRequest,
    listNotFoundErrorMessages:
      SwaggerErrorMessages.posts.getPostComments.notFound,
    auth: true,
  })
  @Permission([Permissions.Comments.Read])
  @ResponseMessage(SuccessMessages.posts.GET_POST_COMMENTS)
  @Get("comments")
  async getPostComments(
    @Param() param: GetPostCommentRequestDto,
    @CurrentUser() user: UserAggregate,
  ) {
    const query = new GetPostCommentQuery({ ...param })
    return await this.service.getPostComments(query)
  }
  // post: create comment
  @ApiOperationDecorator({
    summary: "Create comment",
    description: "Create comment",
    listBadRequestErrorMessages:
      SwaggerErrorMessages.posts.createComment.badRequest,
    listNotFoundErrorMessages:
      SwaggerErrorMessages.posts.createComment.notFound,
    auth: true,
  })
  @Permission([Permissions.Comments.Create, Permissions.Comments.Update])
  @ResponseMessage(SuccessMessages.posts.CREATE_COMMENT)
  @Post("comments/:postId")
  async createComment(
    @Param("postId") param: string,
    @CurrentUser() user: UserAggregate,
    @Body() data: CreateCommentRequestDTO,
  ) {
    const command = new CreateCommentCommand({
      ...data,
      userId: user.id,
      postId: param,
    })
    await this.service.createComment(command)
  }
  // patch: create comment
  @ApiOperationDecorator({
    summary: "Update post comment",
    description: "Update comment of a post",
    listBadRequestErrorMessages:
      SwaggerErrorMessages.posts.updateComment.badRequest,
    listNotFoundErrorMessages:
      SwaggerErrorMessages.posts.updateComment.notFound,
    auth: true,
  })
  @Permission([Permissions.Comments.Create, Permissions.Comments.Update])
  @ResponseMessage(SuccessMessages.posts.UPDATE_COMMENT)
  @Patch("comments/:commentId")
  async updateComment(
    @Param("commentId") param: string,
    @CurrentUser() user: UserAggregate,
    @Body() data: UpdateCommentRequestDTO,
  ) {
    const command = new UpdateCommentCommand({
      ...data,
      userId: user.id,
      commentId: param,
    })
    await this.service.updateComment(command)
  }
  // post: create schedule post
  @ApiOperationDecorator({
    summary: "Create schedule post",
    description: "Create schedule post by user",
    listBadRequestErrorMessages:
      SwaggerErrorMessages.posts.createUserPost.badRequest,
    listNotFoundErrorMessages:
      SwaggerErrorMessages.posts.createUserPost.notFound,
    auth: true,
    fileFieldName: "images",
  })
  @Permission([Permissions.Posts.Create])
  @ResponseMessage(SuccessMessages.posts.CREATE_SCHEDULE_USER_POST)
  @UseInterceptors(FilesInterceptor("images"))
  @Post("/schedule-post")
  async createScheduledGroupPost(
    @Body() data: CreateScheduledUserPostRequestDto,
    @CurrentUser() user: UserAggregate,

    @UploadedFiles() images: Express.Multer.File[],
  ): Promise<void> {
    // console.log(data)
    const command = new CreateScheduleUserPostCommand({
      ...data,
      images,

      userId: user.id,
    })
    await this.service.createSchedulePost(command)
  }
}
