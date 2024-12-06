import { Injectable } from "@nestjs/common"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { FollowCommand } from "./command/follow/follow.command"
import { UnfollowCommand } from "./command/unfollow/unfollow.command"
import { GetListFollowersQuery } from "./query/get-list-followers/get-list-followers.query"
import { GetListFollowingsQuery } from "./query/get-list-followings/get-list-followings.query"
import { IsFollowQuery } from "./query/is-follow/is-follow.query"

@Injectable()
export class FollowerService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  follow(command: FollowCommand) {
    return this.commandBus.execute(command)
  }
  unfollow(command: UnfollowCommand) {
    return this.commandBus.execute(command)
  }
  getListFollowers(query: GetListFollowersQuery) {
    return this.queryBus.execute(query)
  }
  getListFollowings(query: GetListFollowingsQuery) {
    return this.queryBus.execute(query)
  }
  isFollow(query: IsFollowQuery) {
    return this.queryBus.execute(query)
  }
}
