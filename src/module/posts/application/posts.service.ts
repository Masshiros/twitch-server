import { Injectable } from "@nestjs/common"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { ReactToPostCommand } from "./command/react-to-post/react-to-post.command"

@Injectable()
export class PostsService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  async reactToPost(command: ReactToPostCommand) {
    return await this.commandBus.execute(command)
  }
}
