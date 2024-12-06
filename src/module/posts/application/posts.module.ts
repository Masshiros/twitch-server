import { BullModule } from "@nestjs/bullmq"
import { Module } from "@nestjs/common"
import { CqrsModule } from "@nestjs/cqrs"
import { Bull } from "libs/constants/bull"
import { FollowersDatabaseModule } from "src/module/followers/infrastructure/database/followers.database.module"
import { FriendsDatabaseModule } from "src/module/friends/infrastructure/database/friend.database.module"
import { ImageModule } from "src/module/image/application/image.module"
import { UserDatabaseModule } from "src/module/users/infrastructure/database/user.database.module"
import { PostCronModule } from "../infrastructure/cronjob/post.cronjob.module"
import { PostsDatabaseModule } from "../infrastructure/database/posts.database.module"
import { PostListener } from "../infrastructure/event-listener/post.listener"
import { PostProcessorModule } from "../infrastructure/processor/post.processor.module"
import { PostsController } from "../presentation/posts.controller"
import { CreateCommentHandler } from "./command/create-comment/create-comment.handler"
import { CreateScheduleUserPostHandler } from "./command/create-schedule-user-post/create-schedule-user-post.handler"
import { CreateUserPostHandler } from "./command/create-user-post/create-user-post.handler"
import { DeleteUserPostHandler } from "./command/delete-user-post/delete-user-post.handler"
import { EditUserPostHandler } from "./command/edit-user-post/edit-user-post.handler"
import { ReactToPostHandler } from "./command/react-to-post/react-to-post.handler"
import { SharePostHandler } from "./command/share-post/share-post.handler"
import { ToggleHidePostsFromUserHandler } from "./command/toggle-hide-posts-from-user/toggle-hide-posts-from-user.handler"
import { UpdateCommentHandler } from "./command/update-comment/update-comment.handler"
import { ViewPostHandler } from "./command/view-post/view-post.handler"
import { PostsService } from "./posts.service"
import { GetAllReactionsHandler } from "./query/get-all-reactions/get-all-reactions.handler"
import { GetPostCommentHandler } from "./query/get-post-comment/get-post-comment.handler"
import { GetPostHandler } from "./query/get-post/get-post.handler"
import { GetReactionsByTypeHandler } from "./query/get-reactions-by-type/get-reactions-by-type.handler"
import { GetUserFeedHandler } from "./query/get-user-feed/get-user-feed.handler"
import { GetUserPostsHandler } from "./query/get-user-posts/get-user-posts.handler"
import { SearchPostHandler } from "./query/search-post/search-post.handler"

const commandHandlers = [
  ReactToPostHandler,
  ToggleHidePostsFromUserHandler,
  CreateUserPostHandler,
  DeleteUserPostHandler,
  EditUserPostHandler,
  SharePostHandler,
  CreateCommentHandler,
  UpdateCommentHandler,
  CreateScheduleUserPostHandler,
  ViewPostHandler,
]
const queryHandlers = [
  GetAllReactionsHandler,
  GetReactionsByTypeHandler,
  GetUserPostsHandler,
  GetUserFeedHandler,
  GetPostCommentHandler,
  GetPostHandler,
  SearchPostHandler,
]
@Module({
  controllers: [PostsController],
  providers: [PostsService, ...commandHandlers, ...queryHandlers, PostListener],
  imports: [
    BullModule.registerQueue({
      name: Bull.queue.user_post.cache_post,
      prefix: "TWITCH",
    }),
    BullModule.registerQueue({
      name: Bull.queue.user_post.cache_comment,
      prefix: "TWITCH",
    }),
    BullModule.registerQueue({
      name: Bull.queue.user_post.post_view,
      prefix: "TWITCH",
    }),
    CqrsModule,
    PostsDatabaseModule,
    UserDatabaseModule,
    ImageModule,
    FriendsDatabaseModule,
    FollowersDatabaseModule,
    PostCronModule,
    PostProcessorModule,
  ],
})
export class PostsModule {}
