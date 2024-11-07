import { Injectable } from "@nestjs/common"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { SendFriendRequestCommand } from "./command/send-friend-request.command"

@Injectable()
export class FriendService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  async sendFriendRequest(command: SendFriendRequestCommand) {
    return this.commandBus.execute(command)
  }
}
