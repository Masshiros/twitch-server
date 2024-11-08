import { Injectable } from "@nestjs/common"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { AcceptFriendRequestCommand } from "./command/accept-friend-request/accept-friend-request.command"
import { RejectFriendRequestCommand } from "./command/reject-friend-request/reject-friend-request.command"
import { RemoveFriendCommand } from "./command/remove-friend/remove-friend.command"
import { SendFriendRequestCommand } from "./command/send-friend-request/send-friend-request.command"
import { GetListFriendRequestQuery } from "./query/get-list-friend-requests/get-list-friend-requests.query"
import { GetListFriendQuery } from "./query/get-list-friend/get-list-friend.query"

@Injectable()
export class FriendService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  async sendFriendRequest(command: SendFriendRequestCommand) {
    return this.commandBus.execute(command)
  }
  async acceptFriendRequest(command: AcceptFriendRequestCommand) {
    return this.commandBus.execute(command)
  }
  async rejectFriendRequest(command: RejectFriendRequestCommand) {
    return this.commandBus.execute(command)
  }
  async removeFriend(command: RemoveFriendCommand) {
    return this.commandBus.execute(command)
  }
  async getListFriendRequests(query: GetListFriendRequestQuery) {
    return this.queryBus.execute(query)
  }
  async getListFriends(query: GetListFriendQuery) {
    return this.queryBus.execute(query)
  }
}
