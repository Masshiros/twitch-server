import { Module } from "@nestjs/common"
import { FollowersDatabaseModule } from "src/module/followers/infrastructure/database/followers.database.module"
import { FriendsDatabaseModule } from "src/module/friends/infrastructure/database/friend.database.module"
import { NotificationDatabaseModule } from "src/module/notifications/infrastructure/database/notification.database.module"
import { UserDatabaseModule } from "src/module/users/infrastructure/database/user.database.module"
import { PostsDatabaseModule } from "../database/posts.database.module"
import { CacheCommentProcessor } from "./cache-comment.processor"
import { CachePostProcessor } from "./cache-post.processor"
import { PostViewProcessor } from "./post-view.processor"
import { SchedulePostProcessor } from "./schedule-post.processor"

@Module({
  imports: [
    PostsDatabaseModule,
    FollowersDatabaseModule,
    FriendsDatabaseModule,
    UserDatabaseModule,
    NotificationDatabaseModule,
  ],
  providers: [
    SchedulePostProcessor,
    CachePostProcessor,
    PostViewProcessor,
    CacheCommentProcessor,
  ],
  exports: [
    SchedulePostProcessor,
    CachePostProcessor,
    PostViewProcessor,
    CacheCommentProcessor,
  ],
})
export class PostProcessorModule {}
