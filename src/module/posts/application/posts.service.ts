import { Injectable } from "@nestjs/common"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { CreateCommentCommand } from "./command/create-comment/create-comment.command"
import { CreateScheduleUserPostCommand } from "./command/create-schedule-user-post/create-schedule-user-post.command"
import { CreateUserPostCommand } from "./command/create-user-post/create-user-post.command"
import { DeleteUserPostCommand } from "./command/delete-user-post/delete-user-post.command"
import { EditUserPostCommand } from "./command/edit-user-post/edit-user-post.command"
import { ReactToPostCommand } from "./command/react-to-post/react-to-post.command"
import { SharePostCommand } from "./command/share-post/share-post.command"
import { ToggleHidePostsFromUserCommand } from "./command/toggle-hide-posts-from-user/toggle-hide-posts-from-user.command"
import { UpdateCommentCommand } from "./command/update-comment/update-comment.command"
import { ViewPostCommand } from "./command/view-post/view-post.command"
import { GetAllReactionsQuery } from "./query/get-all-reactions/get-all-reactions.query"
import { GetPostCommentQuery } from "./query/get-post-comment/get-post-comment.query"
import { GetPostQuery } from "./query/get-post/get-post.query"
import { GetReactionsByTypeQuery } from "./query/get-reactions-by-type/get-reactions-by-type.query"
import { GetUserFeedQuery } from "./query/get-user-feed/get-user-feed.query"
import { GetUserPostsQuery } from "./query/get-user-posts/get-user-posts.query"
import { SearchPostQuery } from "./query/search-post/search-post.query"

@Injectable()
export class PostsService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  async reactToPost(command: ReactToPostCommand) {
    return this.commandBus.execute(command)
  }
  async toggleHidePostFromUser(command: ToggleHidePostsFromUserCommand) {
    return this.commandBus.execute(command)
  }
  async createUserPost(command: CreateUserPostCommand) {
    return this.commandBus.execute(command)
  }
  async deleteUserPost(command: DeleteUserPostCommand) {
    return this.commandBus.execute(command)
  }
  async editUserPost(command: EditUserPostCommand) {
    return this.commandBus.execute(command)
  }
  async sharePost(command: SharePostCommand) {
    return this.commandBus.execute(command)
  }
  async getAllReactions(query: GetAllReactionsQuery) {
    return this.queryBus.execute(query)
  }
  async getReactionsByType(query: GetReactionsByTypeQuery) {
    return this.queryBus.execute(query)
  }
  async getUserPosts(query: GetUserPostsQuery) {
    return this.queryBus.execute(query)
  }
  async getPost(query: GetPostQuery) {
    return this.queryBus.execute(query)
  }
  async getUserFeed(query: GetUserFeedQuery) {
    return this.queryBus.execute(query)
  }
  async searchPost(query: SearchPostQuery) {
    return this.queryBus.execute(query)
  }
  async createComment(command: CreateCommentCommand) {
    return this.commandBus.execute(command)
  }
  async updateComment(command: UpdateCommentCommand) {
    return this.commandBus.execute(command)
  }
  async getPostComments(query: GetPostCommentQuery) {
    return this.queryBus.execute(query)
  }
  async createSchedulePost(command: CreateScheduleUserPostCommand) {
    return this.commandBus.execute(command)
  }
  async viewPost(command: ViewPostCommand) {
    return this.commandBus.execute(command)
  }
}
