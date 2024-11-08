import { Module } from "@nestjs/common"
import { CqrsModule } from "@nestjs/cqrs"
import { ImageModule } from "src/module/image/application/image.module"
import { UserDatabaseModule } from "src/module/users/infrastructure/database/user.database.module"
import { FriendsDatabaseModule } from "../infrastructure/database/friend.database.module"
import { FriendController } from "../presentation/friend.controller"
import { AcceptFriendRequestHandler } from "./command/accept-friend-request/accept-friend-request.handler"
import { RejectFriendRequestHandler } from "./command/reject-friend-request/reject-friend-request.handler"
import { SendFriendRequestHandler } from "./command/send-friend-request/send-friend-request.handler"
import { FriendService } from "./friend.service"
import { GetListFriendRequestHandler } from "./query/get-list-friend-requests/get-list-friend-requests.handler"

const commandHandlers = [
  SendFriendRequestHandler,
  AcceptFriendRequestHandler,
  RejectFriendRequestHandler,
]
const queryHandlers = [GetListFriendRequestHandler]
@Module({
  controllers: [FriendController],
  providers: [FriendService, ...commandHandlers, ...queryHandlers],
  imports: [CqrsModule, FriendsDatabaseModule, UserDatabaseModule, ImageModule],
})
export class FriendsModule {}
