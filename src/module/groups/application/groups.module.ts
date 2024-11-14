import { Module } from "@nestjs/common"
import { CqrsModule } from "@nestjs/cqrs"
import { FriendsDatabaseModule } from "src/module/friends/infrastructure/database/friend.database.module"
import { ImageModule } from "src/module/image/application/image.module"
import { PostsDatabaseModule } from "src/module/posts/infrastructure/database/posts.database.module"
import { UserDatabaseModule } from "src/module/users/infrastructure/database/user.database.module"
import { GroupDatabaseModule } from "../infrastructure/database/group.database.module"
import { GroupsController } from "../presentation/groups.controller"
import { AcceptInvitationHandler } from "./command/accept-invitation/accept-invitation.handler"
import { AcceptRequestHandler } from "./command/accept-request/accept-request.handler"
import { AddCoverImageHandler } from "./command/add-cover-image/add-cover-image.handler"
import { AddDescriptionHandler } from "./command/add-description/add-description.handler"
import { CreateGroupPostHandler } from "./command/create-group-post/create-group-post.handler"
import { CreateGroupHandler } from "./command/create-group/create-group.handler"
import { InviteMembersHandler } from "./command/invite-members/invite-members.handler"
import { RejectInvitationHandler } from "./command/reject-invitation/reject-imvitation.handler"
import { RejectRequestHandler } from "./command/reject-request/reject-request.handler"
import { RequestToJoinGroupHandler } from "./command/request-to-join-group/request-to-join-group.handler"
import { GroupsService } from "./groups.service"
import { GetGroupHandler } from "./query/get-group/get-group.handler"
import { GetJoinedGroupHandler } from "./query/get-joined-groups/get-joined-groups.handler"
import { GetManageGroupHandler } from "./query/get-manage-groups/get-manage-groups.handler"
import { GetPendingRequestsHandler } from "./query/get-pending-requests/get-pending-requests.handler"

const commandHandlers = [
  CreateGroupHandler,
  CreateGroupPostHandler,
  AddCoverImageHandler,
  AddDescriptionHandler,
  InviteMembersHandler,
  AcceptInvitationHandler,
  RejectInvitationHandler,
  RequestToJoinGroupHandler,
  AcceptRequestHandler,
  RejectRequestHandler,
]
const queryHandlers = [
  GetGroupHandler,
  GetJoinedGroupHandler,
  GetManageGroupHandler,
  GetPendingRequestsHandler,
]
@Module({
  controllers: [GroupsController],
  providers: [GroupsService, ...commandHandlers, ...queryHandlers],
  imports: [
    CqrsModule,
    GroupDatabaseModule,
    UserDatabaseModule,
    ImageModule,
    FriendsDatabaseModule,
  ],
})
export class GroupsModule {}
