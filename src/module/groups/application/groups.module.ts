import { Module } from "@nestjs/common"
import { CqrsModule } from "@nestjs/cqrs"
import { FriendsDatabaseModule } from "src/module/friends/infrastructure/database/friend.database.module"
import { ImageModule } from "src/module/image/application/image.module"
import { PostsDatabaseModule } from "src/module/posts/infrastructure/database/posts.database.module"
import { UserDatabaseModule } from "src/module/users/infrastructure/database/user.database.module"
import { GroupDatabaseModule } from "../infrastructure/database/group.database.module"
import { GroupsController } from "../presentation/groups.controller"
import { AcceptInvitationHandler } from "./command/accept-invitation/accept-invitation.handler"
import { AddCoverImageHandler } from "./command/add-cover-image/add-cover-image.handler"
import { AddDescriptionHandler } from "./command/add-description/add-description.handler"
import { CreateGroupHandler } from "./command/create-group/create-group.handler"
import { InviteMembersHandler } from "./command/invite-members/invite-members.handler"
import { RejectInvitationHandler } from "./command/reject-invitation/reject-imvitation.handler"
import { GroupsService } from "./groups.service"

const commandHandlers = [
  CreateGroupHandler,
  AddCoverImageHandler,
  AddDescriptionHandler,
  InviteMembersHandler,
  AcceptInvitationHandler,
  RejectInvitationHandler,
]
const queryHandlers = []
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
