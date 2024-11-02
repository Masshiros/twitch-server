import { Injectable } from "@nestjs/common"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { ReactToPostCommand } from "./command/react-to-post/react-to-post.command"
import { ToggleHidePostsFromUserCommand } from "./command/toggle-hide-posts-from-user/toggle-hide-posts-from-user.command"

@Injectable()
export class PostsService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  async reactToPost(command: ReactToPostCommand) {
    return await this.commandBus.execute(command)
  }
  async toggleHidePostFromUser(command: ToggleHidePostsFromUserCommand) {
    return await this.commandBus.execute(command)
  }
}
