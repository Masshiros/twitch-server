import { Injectable } from "@nestjs/common"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { AcceptInvitationCommand } from "./command/accept-invitation/accept-invitation.command"
import { AcceptRequestCommand } from "./command/accept-request/accept-request.command"
import { AddCoverImageCommand } from "./command/add-cover-image/add-cover-image.command"
import { AddDescriptionCommand } from "./command/add-description/add-description.command"
import { CreateGroupPostCommand } from "./command/create-group-post/create-group-post.command"
import { CreateGroupCommand } from "./command/create-group/create-group.command"
import { InviteMembersCommand } from "./command/invite-members/invite-members.command"
import { RejectInvitationCommand } from "./command/reject-invitation/reject-invitation.command"
import { RejectRequestCommand } from "./command/reject-request/reject-request.command"
import { RequestToJoinGroupCommand } from "./command/request-to-join-group/request-to-join-group.command"
import { GetGroupQuery } from "./query/get-group/get-group.query"
import { GetJoinedGroupQuery } from "./query/get-joined-groups/get-joined-groups.query"
import { GetManageGroupQuery } from "./query/get-manage-groups/get-manage-groups.query"
import { GetPendingRequestsQuery } from "./query/get-pending-requests/get-pending-requests.query"

@Injectable()
export class GroupsService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  async createGroup(command: CreateGroupCommand) {
    return this.commandBus.execute(command)
  }
  async addCoverImage(command: AddCoverImageCommand) {
    return this.commandBus.execute(command)
  }
  async addDescription(command: AddDescriptionCommand) {
    return this.commandBus.execute(command)
  }
  async inviteMembers(command: InviteMembersCommand) {
    return this.commandBus.execute(command)
  }
  async acceptInvitation(command: AcceptInvitationCommand) {
    return this.commandBus.execute(command)
  }
  async rejectInvitation(command: RejectInvitationCommand) {
    return this.commandBus.execute(command)
  }
  async getGroup(query: GetGroupQuery) {
    return this.queryBus.execute(query)
  }
  async getJoinedGroup(query: GetJoinedGroupQuery) {
    return this.queryBus.execute(query)
  }
  async getManageGroup(query: GetManageGroupQuery) {
    return this.queryBus.execute(query)
  }
  async getPendingRequests(query: GetPendingRequestsQuery) {
    return this.queryBus.execute(query)
  }
  async requestToJoinGroup(command: RequestToJoinGroupCommand) {
    return this.commandBus.execute(command)
  }
  async acceptRequest(command: AcceptRequestCommand) {
    return this.commandBus.execute(command)
  }
  async rejectRequest(command: RejectRequestCommand) {
    return this.commandBus.execute(command)
  }
  async createGroupPost(command: CreateGroupPostCommand) {
    return this.commandBus.execute(command)
  }
}
