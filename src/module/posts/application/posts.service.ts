import { Injectable } from "@nestjs/common"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { CreateUserPostCommand } from "./command/create-user-post/create-user-post.command"
import { DeleteUserPostCommand } from "./command/delete-user-post/delete-user-post.command"
import { EditUserPostCommand } from "./command/edit-user-post/edit-user-post.command"
import { ReactToPostCommand } from "./command/react-to-post/react-to-post.command"
import { ToggleHidePostsFromUserCommand } from "./command/toggle-hide-posts-from-user/toggle-hide-posts-from-user.command"
import { GetAllReactionsQuery } from "./query/get-all-reactions/get-all-reactions.query"
import { GetReactionsByTypeQuery } from "./query/get-reactions-by-type/get-reactions-by-type.query"

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
  async getAllReactions(query: GetAllReactionsQuery) {
    return this.queryBus.execute(query)
  }
  async getReactionsByType(query: GetReactionsByTypeQuery) {
    return this.queryBus.execute(query)
  }
}
