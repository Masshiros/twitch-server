import { Module } from "@nestjs/common"
import { CqrsModule } from "@nestjs/cqrs"
import { UserDatabaseModule } from "src/module/users/infrastructure/database/user.database.module"
import { FriendsDatabaseModule } from "../infrastructure/database/friend.database.module"
import { FriendController } from "../presentation/friend.controller"
import { SendFriendRequestHandler } from "./command/send-friend-request.handler"
import { FriendService } from "./friend.service"

const commandHandlers = [SendFriendRequestHandler]
const queryHandlers = []
@Module({
  controllers: [FriendController],
  providers: [FriendService, ...commandHandlers, ...queryHandlers],
  imports: [CqrsModule, FriendsDatabaseModule, UserDatabaseModule],
})
export class FriendsModule {}
