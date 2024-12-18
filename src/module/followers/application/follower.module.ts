import { Module } from "@nestjs/common"
import { CqrsModule } from "@nestjs/cqrs"
import { ImageModule } from "src/module/image/application/image.module"
import { NotificationDatabaseModule } from "src/module/notifications/infrastructure/database/notification.database.module"
import { UserDatabaseModule } from "src/module/users/infrastructure/database/user.database.module"
import { FollowerFactory } from "../domain/factory/followers.factory"
import { FollowersDatabaseModule } from "../infrastructure/database/followers.database.module"
import { FollowerController } from "../presentation/follower.controller"
import { FollowCommandHandler } from "./command/follow/follow.handler"
import { UnfollowCommandHandler } from "./command/unfollow/unfollow.handler"
import { FollowerService } from "./follower.service"
import { GetListFollowersQueryHandler } from "./query/get-list-followers/get-list-followers.handler"
import { GetListFollowingsQueryHandler } from "./query/get-list-followings/get-list-followings.handler"
import { IsFollowQueryHandler } from "./query/is-follow/is-follow.handler"

const commandHandlers = [FollowCommandHandler, UnfollowCommandHandler]
const queryHandlers = [
  GetListFollowersQueryHandler,
  GetListFollowingsQueryHandler,
  IsFollowQueryHandler,
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
    NotificationDatabaseModule,
    ImageModule,
  ],
})
export class FollowerModule {}
