import { Module } from "@nestjs/common"
import { CqrsModule } from "@nestjs/cqrs"
import { ImageModule } from "src/module/image/application/image.module"
import { UserDatabaseModule } from "src/module/users/infrastructure/database/user.database.module"
import { FriendsDatabaseModule } from "../infrastructure/database/friend.database.module"
import { FriendController } from "../presentation/friend.controller"
import { AcceptFriendRequestHandler } from "./command/accept-friend-request/accept-friend-request.handler"
import { IsFriendHandler } from "./query/is-friend/is-friend.handler"
import { RejectFriendRequestHandler } from "./command/reject-friend-request/reject-friend-request.handler"
import { RemoveFriendHandler } from "./command/remove-friend/remove-friend.handler"
import { SendFriendRequestHandler } from "./command/send-friend-request/send-friend-request.handler"
import { FriendService } from "./friend.service"
import { GetListFriendRequestHandler } from "./query/get-list-friend-requests/get-list-friend-requests.handler"
import { GetListFriendHandler } from "./query/get-list-friend/get-list-friend.handler"
import { GetMutualFriendsHandler } from "./query/get-mutual-friend/get-mutual-friends.handler"

const commandHandlers = [
  SendFriendRequestHandler,
  AcceptFriendRequestHandler,
  RejectFriendRequestHandler,
  RemoveFriendHandler,
  IsFriendHandler,
]
const queryHandlers = [
  GetListFriendRequestHandler,
  GetListFriendHandler,
  GetMutualFriendsHandler,
]
@Module({
  controllers: [FriendController],
  providers: [FriendService, ...commandHandlers, ...queryHandlers],
  imports: [CqrsModule, FriendsDatabaseModule, UserDatabaseModule, ImageModule],
})
export class FriendsModule {}
