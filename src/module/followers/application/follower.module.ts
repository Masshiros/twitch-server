import { Module } from "@nestjs/common"
import { CqrsModule } from "@nestjs/cqrs"
import { ImageModule } from "src/module/image/application/image.module"
import { UserDatabaseModule } from "src/module/users/infrastructure/database/user.database.module"
import { FollowerFactory } from "../domain/factory/followers.factory"
import { FollowersDatabaseModule } from "../infrastructure/database/followers.database.module"
import { FollowerController } from "../presentation/follower.controller"
import { FollowCommandHandler } from "./command/follow/follow.handler"
import { UnfollowCommandHandler } from "./command/unfollow/unfollow.handler"
import { FollowerService } from "./follower.service"
import { GetListFollowersQueryHandler } from "./query/get-list-followers/get-list-followers.handler"
import { GetListFollowingsQueryHandler } from "./query/get-list-followings/get-list-followings.handler"

const commandHandlers = [FollowCommandHandler, UnfollowCommandHandler]
const queryHandlers = [
  GetListFollowersQueryHandler,
  GetListFollowingsQueryHandler,
]
@Module({
  controllers: [FollowerController],
  providers: [
    FollowerFactory,
    FollowerService,
    ...commandHandlers,
    ...queryHandlers,
  ],
  imports: [
    CqrsModule,
    FollowersDatabaseModule,
    UserDatabaseModule,
    ImageModule,
  ],
})
export class FollowerModule {}
