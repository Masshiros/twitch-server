import { Module } from "@nestjs/common"
import { CqrsModule } from "@nestjs/cqrs"
import { ImageModule } from "src/module/image/application/image.module"
import { UserDatabaseModule } from "src/module/users/infrastructure/database/user.database.module"
import { PostsDatabaseModule } from "../infrastructure/database/posts.database.module"
import { PostsController } from "../presentation/posts.controller"
import { CreateUserPostHandler } from "./command/create-user-post/create-user-post.handler"
import { DeleteUserPostHandler } from "./command/delete-user-post/delete-user-post.handler"
import { EditUserPostHandler } from "./command/edit-user-post/edit-user-post.handler"
import { ReactToPostHandler } from "./command/react-to-post/react-to-post.handler"
import { ToggleHidePostsFromUserHandler } from "./command/toggle-hide-posts-from-user/toggle-hide-posts-from-user.handler"
import { PostsService } from "./posts.service"
import { GetAllReactionsHandler } from "./query/get-all-reactions/get-all-reactions.handler"

const commandHandlers = [
  ReactToPostHandler,
  ToggleHidePostsFromUserHandler,
  CreateUserPostHandler,
  DeleteUserPostHandler,
  EditUserPostHandler,
]
const queryHandlers = [GetAllReactionsHandler]
@Module({
  controllers: [PostsController],
  providers: [PostsService, ...commandHandlers, ...queryHandlers],
  imports: [CqrsModule, PostsDatabaseModule, UserDatabaseModule, ImageModule],
})
export class PostsModule {}
