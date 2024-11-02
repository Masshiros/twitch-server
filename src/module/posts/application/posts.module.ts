import { Module } from "@nestjs/common"
import { CqrsModule } from "@nestjs/cqrs"
import { UserDatabaseModule } from "src/module/users/infrastructure/database/user.database.module"
import { PostsDatabaseModule } from "../infrastructure/database/posts.database.module"
import { PostsController } from "../presentation/posts.controller"
import { ReactToPostHandler } from "./command/react-to-post/react-to-post.handler"
import { PostsService } from "./posts.service"

const commandHandlers = [ReactToPostHandler]
const queryHandlers = []
@Module({
  controllers: [PostsController],
  providers: [PostsService, ...commandHandlers, ...queryHandlers],
  imports: [CqrsModule, PostsDatabaseModule, UserDatabaseModule],
})
export class PostsModule {}
