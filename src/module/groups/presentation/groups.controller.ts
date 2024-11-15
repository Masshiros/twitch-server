import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common"
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express"
import { ApiTags } from "@nestjs/swagger"
import { Permissions } from "libs/constants/permissions"
import { SuccessMessages } from "libs/constants/success"
import { SwaggerErrorMessages } from "libs/constants/swagger-error-messages"
import { ApiOperationDecorator } from "libs/decorator/api-operation.decorator"
import { CurrentUser } from "libs/decorator/current-user.decorator"
import { Permission } from "libs/decorator/permission.decorator"
import { ResponseMessage } from "libs/decorator/response-message.decorator"
import { FileValidationPipe } from "libs/pipe/image-validation.pipe"
import { UserAggregate } from "src/module/users/domain/aggregate"
import { AcceptInvitationCommand } from "../application/command/accept-invitation/accept-invitation.command"
import { AcceptRequestCommand } from "../application/command/accept-request/accept-request.command"
import { AddCoverImageCommand } from "../application/command/add-cover-image/add-cover-image.command"
import { AddDescriptionCommand } from "../application/command/add-description/add-description.command"
import { ApproveGroupPostCommand } from "../application/command/approve-group-post/approve-group-post.command"
import { CreateGroupPostCommand } from "../application/command/create-group-post/create-group-post.command"
import { CreateGroupCommand } from "../application/command/create-group/create-group.command"
import { InviteMembersCommand } from "../application/command/invite-members/invite-members.command"
import { RejectGroupPostCommand } from "../application/command/reject-group-post/reject-group-post.command"
import { RejectInvitationCommand } from "../application/command/reject-invitation/reject-invitation.command"
import { RejectRequestCommand } from "../application/command/reject-request/reject-request.command"
import { RequestToJoinGroupCommand } from "../application/command/request-to-join-group/request-to-join-group.command"
import { GroupsService } from "../application/groups.service"
import { GetGroupQuery } from "../application/query/get-group/get-group.query"
import { GetJoinedGroupQuery } from "../application/query/get-joined-groups/get-joined-groups.query"
import { GetManageGroupQuery } from "../application/query/get-manage-groups/get-manage-groups.query"
import { GetMembersQuery } from "../application/query/get-members/get-members.query"
import { GetPendingPostsQuery } from "../application/query/get-pending-posts/get-pending-posts.query"
import { GetPendingRequestsQuery } from "../application/query/get-pending-requests/get-pending-requests.query"
import { AcceptRequestRequestDto } from "./http/dto/request/accept-request.request.dto"
import { AddCoverImageRequestDto } from "./http/dto/request/add-cover-image.request.dto"
import { AddDescriptionRequestDto } from "./http/dto/request/add-description.request.dto"
import { ApproveGroupPostRequestDto } from "./http/dto/request/approve-group-post.request.dto"
import { CreateGroupPostRequestDto } from "./http/dto/request/create-group-post.request.dto"
import { CreateGroupRequestDto } from "./http/dto/request/create-group.request.dto"
import { GetJoinedGroupsRequestDto } from "./http/dto/request/get-joined-groups.request.dto"
import { GetManageGroupRequestDto } from "./http/dto/request/get-manage-group.request.dto"
import { GetPendingPostsRequestDto } from "./http/dto/request/get-pending-posts.request.dto"
import { GetPendingRequestsRequestDto } from "./http/dto/request/get-pending-requests.request.dto"
import { InviteMembersRequestDto } from "./http/dto/request/invite-members.request.dto"
import { RejectGroupPostRequestDto } from "./http/dto/request/reject-group-post.request.dto"
import { RejectRequestRequestDto } from "./http/dto/request/reject-request.request.dto"
import { GetGroupResponseDto } from "./http/dto/response/get-group.response.dto"
import { GetJoinedGroupResponseDto } from "./http/dto/response/get-joined-group.response.dto"
import { GetManageGroupResponseDto } from "./http/dto/response/get-manage-group.response.dto"
import { GetPendingPostsResponseDto } from "./http/dto/response/get-pending-posts.response.dto"

@ApiTags("groups")
@Controller("groups")
export class GroupsController {
  constructor(private readonly service: GroupsService) {}
  // post: create group
  @ApiOperationDecorator({
    summary: "Create a group",
    description: "Current logged in user create a new group",
    listBadRequestErrorMessages:
      SwaggerErrorMessages.groups.createGroup.badRequest,
    listNotFoundErrorMessages: SwaggerErrorMessages.groups.createGroup.notFound,
    auth: true,
  })
  @Permission([Permissions.Groups.Create])
  @ResponseMessage(SuccessMessages.groups.CREATE_GROUP)
  @Post()
  async createGroup(
    @Body() data: CreateGroupRequestDto,
    @CurrentUser() user: UserAggregate,
  ): Promise<void> {
    // console.log(data)
    const command = new CreateGroupCommand({
      ...data,
      ownerId: user.id,
    })
    // console.log(command)
    await this.service.createGroup(command)
  }
  // post: add cover image
  @ApiOperationDecorator({
    summary: "Add cover image to a group",
    description: "Add a cover image to group by admin",
    listBadRequestErrorMessages:
      SwaggerErrorMessages.groups.addCoverImage.badRequest,
    listNotFoundErrorMessages:
      SwaggerErrorMessages.groups.addCoverImage.notFound,
    auth: true,
    fileFieldName: "image",
  })
  @Permission([Permissions.Groups.Update])
  @ResponseMessage(SuccessMessages.groups.ADD_COVER_IMAGE)
  @UseInterceptors(FileInterceptor("image"))
  @Post("/:groupId/cover-image")
  async addCoverImage(
    @Param("groupId") param: string,
    @Body() data: AddCoverImageRequestDto,
    @UploadedFile(new FileValidationPipe()) image: Express.Multer.File,
    @CurrentUser() user: UserAggregate,
  ) {
    const command = new AddCoverImageCommand({
      userId: user.id,
      image: image,
      groupId: param,
    })
    console.log(command)
    await this.service.addCoverImage(command)
  }
  // post: add description
  @ApiOperationDecorator({
    summary: "Add description to a group",
    description: "Add a description to group by admin",
    listBadRequestErrorMessages:
      SwaggerErrorMessages.groups.addDescription.badRequest,
    listNotFoundErrorMessages:
      SwaggerErrorMessages.groups.addDescription.notFound,
    auth: true,
  })
  @Permission([Permissions.Groups.Update])
  @ResponseMessage(SuccessMessages.groups.ADD_DESCRIPTION)
  @Post("/:groupId/description")
  async addDescription(
    @Param("groupId") param: string,
    @Body() data: AddDescriptionRequestDto,
    @CurrentUser() user: UserAggregate,
  ) {
    const command = new AddDescriptionCommand({
      groupId: param,
      description: data.description,
      userId: user.id,
    })
    console.log(command)
    await this.service.addDescription(command)
  }
  // Post: Invite members
  @ApiOperationDecorator({
    summary: "Invite a person to join a group",
    description: "Invite a person to join a group by member",
    listBadRequestErrorMessages:
      SwaggerErrorMessages.groups.inviteMembers.badRequest,
    listNotFoundErrorMessages:
      SwaggerErrorMessages.groups.inviteMembers.notFound,
    auth: true,
  })
  @Permission([Permissions.Groups.Update])
  @ResponseMessage(SuccessMessages.groups.INVITE_MEMBERS)
  @Post("/:groupId/invite")
  async inviteMembers(
    @Param("groupId") param: string,
    @Body() data: InviteMembersRequestDto,
    @CurrentUser() user: UserAggregate,
  ) {
    const command = new InviteMembersCommand({
      userId: user.id,
      friendIds: data.friendIds,
      groupId: param,
    })
    console.log(command)
    await this.service.inviteMembers(command)
  }
  // POST: Accept invitation
  @ApiOperationDecorator({
    summary: "Accept an invitation",
    description: "Accept an invitation by user",
    listBadRequestErrorMessages:
      SwaggerErrorMessages.groups.acceptInvitation.badRequest,
    listNotFoundErrorMessages:
      SwaggerErrorMessages.groups.acceptInvitation.notFound,
    auth: true,
  })
  @Permission([Permissions.Groups.Read])
  @ResponseMessage(SuccessMessages.groups.ACCEPT_INVITATION)
  @Post("/:groupId/accept-invitation")
  async acceptInvitation(
    @Param("groupId") param: string,

    @CurrentUser() user: UserAggregate,
  ) {
    const command = new AcceptInvitationCommand({
      groupId: param,
      userId: user.id,
    })
    console.log(command)
    await this.service.acceptInvitation(command)
  }
  // POST: Reject invitation
  @ApiOperationDecorator({
    summary: "Reject an invitation",
    description: "Reject an invitation by user",
    listBadRequestErrorMessages:
      SwaggerErrorMessages.groups.rejectInvitation.badRequest,
    listNotFoundErrorMessages:
      SwaggerErrorMessages.groups.rejectInvitation.notFound,
    auth: true,
  })
  @Permission([Permissions.Groups.Read])
  @ResponseMessage(SuccessMessages.groups.REJECT_INVITATION)
  @Post("/:groupId/reject-invitation")
  async rejectInvitation(
    @Param("groupId") param: string,

    @CurrentUser() user: UserAggregate,
  ) {
    const command = new RejectInvitationCommand({
      groupId: param,
      userId: user.id,
    })
    console.log(command)
    await this.service.rejectInvitation(command)
  }
  // Post: Request to join group
  @ApiOperationDecorator({
    summary: "Send request to a group",
    description: "Send request to a group by user",
    listBadRequestErrorMessages:
      SwaggerErrorMessages.groups.requestToJoinGroup.badRequest,
    listNotFoundErrorMessages:
      SwaggerErrorMessages.groups.requestToJoinGroup.notFound,
    auth: true,
  })
  @Permission([Permissions.Groups.Read])
  @ResponseMessage(SuccessMessages.groups.REQUEST_TO_JOIN_GROUP)
  @Post("/:groupId/request-to-join-group")
  async sendRequest(
    @Param("groupId") param: string,

    @CurrentUser() user: UserAggregate,
  ) {
    const command = new RequestToJoinGroupCommand({
      groupId: param,
      userId: user.id,
    })
    console.log(command)
    await this.service.requestToJoinGroup(command)
  }
  // Post: Accept request
  @ApiOperationDecorator({
    summary: "Accept user to join a group",
    description: "Accept user to join a group by admin",
    listBadRequestErrorMessages:
      SwaggerErrorMessages.groups.acceptRequest.badRequest,
    listNotFoundErrorMessages:
      SwaggerErrorMessages.groups.acceptRequest.notFound,
    auth: true,
  })
  @Permission([
    Permissions.Groups.Read,
    Permissions.Groups.Update,
    Permissions.Groups.Delete,
  ])
  @ResponseMessage(SuccessMessages.groups.ACCEPT_REQUEST)
  @Post("/:groupId/accept-request")
  async acceptRequest(
    @Param("groupId") param: string,
    @Body() data: AcceptRequestRequestDto,
    @CurrentUser() user: UserAggregate,
  ) {
    const command = new AcceptRequestCommand({
      userId: user.id,
      groupId: param,
      requestUserId: data.requestUserId,
    })
    console.log(command)
    await this.service.acceptRequest(command)
  }
  // Post: Reject request
  @ApiOperationDecorator({
    summary: "Reject user to join a group",
    description: "Reject user to join a group by admin",
    listBadRequestErrorMessages:
      SwaggerErrorMessages.groups.rejectRequest.badRequest,
    listNotFoundErrorMessages:
      SwaggerErrorMessages.groups.rejectRequest.notFound,
    auth: true,
  })
  @Permission([
    Permissions.Groups.Read,
    Permissions.Groups.Update,
    Permissions.Groups.Delete,
  ])
  @ResponseMessage(SuccessMessages.groups.REJECT_REQUEST)
  @Post("/:groupId/reject-request")
  async rejectRequest(
    @Param("groupId") param: string,
    @Body() data: RejectRequestRequestDto,
    @CurrentUser() user: UserAggregate,
  ) {
    const command = new RejectRequestCommand({
      groupId: param,
      userId: user.id,
      requestUserId: data.requestUserId,
    })
    console.log(command)
    await this.service.rejectRequest(command)
  }
  // GET: get group
  @ApiOperationDecorator({
    summary: "Get a group",
    description: "Get a group by user",
    listBadRequestErrorMessages:
      SwaggerErrorMessages.groups.getGroup.badRequest,
    listNotFoundErrorMessages: SwaggerErrorMessages.groups.getGroup.notFound,
    auth: true,
  })
  @Permission([Permissions.Groups.Read])
  @ResponseMessage(SuccessMessages.groups.GET_GROUP)
  @Get("/:groupId")
  async getGroup(
    @Param("groupId") param: string,
    @CurrentUser() user: UserAggregate,
  ): Promise<GetGroupResponseDto> {
    const query = new GetGroupQuery({
      groupId: param,
      userId: user.id,
    })
    console.log(query)
    return await this.service.getGroup(query)
  }
  // GET: Get joined group
  @ApiOperationDecorator({
    summary: "Get joined group",
    description: "Get joined group by user",
    listBadRequestErrorMessages:
      SwaggerErrorMessages.groups.getJoinedGroups.badRequest,
    listNotFoundErrorMessages:
      SwaggerErrorMessages.groups.getJoinedGroups.notFound,
    auth: true,
  })
  @Permission([Permissions.Groups.Read])
  @ResponseMessage(SuccessMessages.groups.GET_JOINED_GROUP)
  @Get("/me/joined-group")
  async getJoinedGroup(
    @Query() data: GetJoinedGroupsRequestDto,
    @CurrentUser() user: UserAggregate,
  ): Promise<GetJoinedGroupResponseDto> {
    const query = new GetJoinedGroupQuery({
      ...data,
      userId: user.id,
    })
    query.limit = data.limit ?? 5
    query.offset = data.page ? (data.page - 1) * data.limit : null
    return await this.service.getJoinedGroup(query)
  }
  // GET: Get manage group
  @ApiOperationDecorator({
    summary: "Get manage group",
    description: "Get manage group by user",
    listBadRequestErrorMessages:
      SwaggerErrorMessages.groups.getManageGroups.badRequest,
    listNotFoundErrorMessages:
      SwaggerErrorMessages.groups.getManageGroups.notFound,
    auth: true,
  })
  @Permission([
    Permissions.Groups.Read,
    Permissions.Groups.Update,
    Permissions.Groups.Delete,
  ])
  @ResponseMessage(SuccessMessages.groups.GET_MANAGE_GROUP)
  @Get("/me/manage-group")
  async getManageGroup(
    @Query() data: GetManageGroupRequestDto,
    @CurrentUser() user: UserAggregate,
  ): Promise<GetManageGroupResponseDto> {
    const query = new GetManageGroupQuery({
      ...data,
      userId: user.id,
    })
    query.limit = data.limit ?? 5
    query.offset = data.page ? (data.page - 1) * data.limit : null
    return await this.service.getManageGroup(query)
  }
  // GET: Get pending requests
  @ApiOperationDecorator({
    summary: "Get pending requests",
    description: "Get pending requests by admin",
    listBadRequestErrorMessages:
      SwaggerErrorMessages.groups.getPendingRequests.badRequest,
    listNotFoundErrorMessages:
      SwaggerErrorMessages.groups.getPendingRequests.notFound,
    auth: true,
  })
  @Permission([
    Permissions.Groups.Read,
    Permissions.Groups.Update,
    Permissions.Groups.Delete,
  ])
  @ResponseMessage(SuccessMessages.groups.GET_PENDING_REQUESTS)
  @Get("/:groupId/pending-requests")
  async getPendingRequests(
    @Param("groupId") param: string,
    @Query() data: GetPendingRequestsRequestDto,
    @CurrentUser() user: UserAggregate,
  ): Promise<GetPendingRequestsRequestDto> {
    const query = new GetPendingRequestsQuery({
      groupId: param,
      userId: user.id,
    })
    query.limit = data.limit ?? 5
    query.offset = data.page ? (data.page - 1) * data.limit : null
    return await this.service.getPendingRequests(query)
  }
  // GET: Get pending posts
  @ApiOperationDecorator({
    summary: "Get pending posts",
    description: "Get pending posts by admin",
    listBadRequestErrorMessages:
      SwaggerErrorMessages.groups.getPendingPosts.badRequest,
    listNotFoundErrorMessages:
      SwaggerErrorMessages.groups.getPendingPosts.notFound,
    auth: true,
  })
  @Permission([
    Permissions.Groups.Read,
    Permissions.Groups.Update,
    Permissions.Groups.Delete,
  ])
  @ResponseMessage(SuccessMessages.groups.GET_PENDING_REQUESTS)
  @Get("/:groupId/pending-posts")
  async getPendingPosts(
    @Param("groupId") param: string,
    @Query() data: GetPendingPostsRequestDto,
    @CurrentUser() user: UserAggregate,
  ): Promise<GetPendingPostsResponseDto> {
    const query = new GetPendingPostsQuery({
      groupId: param,
      userId: user.id,
    })
    query.limit = data.limit ?? 5
    query.offset = data.page ? (data.page - 1) * data.limit : null
    return await this.service.getPendingPosts(query)
  }
  // post: create group post
  @ApiOperationDecorator({
    summary: "Create group post",
    description: "Create group post by user",
    listBadRequestErrorMessages:
      SwaggerErrorMessages.groups.createGroupPost.badRequest,
    listNotFoundErrorMessages:
      SwaggerErrorMessages.groups.createGroupPost.notFound,
    auth: true,
    fileFieldName: "images",
  })
  @Permission([
    Permissions.Groups.Read,
    Permissions.Groups.Update,
    Permissions.Groups.Delete,
  ])
  @ResponseMessage(SuccessMessages.groups.CREATE_GROUP_POST)
  @UseInterceptors(FilesInterceptor("images"))
  @Post("/post")
  async createGroupPost(
    @Body() data: CreateGroupPostRequestDto,
    @CurrentUser() user: UserAggregate,
    @Query("groupId") groupId: string,
    @UploadedFiles() images: Express.Multer.File[],
  ): Promise<void> {
    // console.log(data)
    const command = new CreateGroupPostCommand({
      ...data,
      images,
      groupId,
      userId: user.id,
    })
    await this.service.createGroupPost(command)
  }
  // post: approve group post
  @ApiOperationDecorator({
    summary: "Approve group post",
    description: "Approve group post by admin",
    listBadRequestErrorMessages:
      SwaggerErrorMessages.groups.approveGroupPost.badRequest,
    listNotFoundErrorMessages:
      SwaggerErrorMessages.groups.approveGroupPost.notFound,
    auth: true,
  })
  @Permission([
    Permissions.Groups.Read,
    Permissions.Groups.Update,
    Permissions.Groups.Delete,
  ])
  @ResponseMessage(SuccessMessages.groups.APPROVE_GROUP_POST)
  @Post("/post-approve/:groupId")
  async approveGroupPost(
    @Query() data: ApproveGroupPostRequestDto,
    @CurrentUser() user: UserAggregate,
    @Query("groupId") groupId: string,
  ): Promise<void> {
    // console.log(data)
    const command = new ApproveGroupPostCommand({
      ...data,
      userId: user.id,
      groupId,
    })
    await this.service.approveGroupPost(command)
  }
  // post: reject group post
  @ApiOperationDecorator({
    summary: "Reject group post",
    description: "Reject group post by admin",
    listBadRequestErrorMessages:
      SwaggerErrorMessages.groups.rejectGroupPost.badRequest,
    listNotFoundErrorMessages:
      SwaggerErrorMessages.groups.rejectGroupPost.notFound,
    auth: true,
  })
  @Permission([
    Permissions.Groups.Read,
    Permissions.Groups.Update,
    Permissions.Groups.Delete,
  ])
  @ResponseMessage(SuccessMessages.groups.APPROVE_GROUP_POST)
  @Post("/post-reject/:groupId")
  async rejectGroupPost(
    @Query() data: RejectGroupPostRequestDto,
    @CurrentUser() user: UserAggregate,
    @Query("groupId") groupId: string,
  ): Promise<void> {
    // console.log(data)
    const command = new RejectGroupPostCommand({
      ...data,
      userId: user.id,
      groupId,
    })
    await this.service.rejectGroupPost(command)
  }
  //get: get group's members
  @ApiOperationDecorator({
    summary: "Get group's members",
    description: "Get group's members by admin",
    listBadRequestErrorMessages:
      SwaggerErrorMessages.groups.getMembers.badRequest,
    listNotFoundErrorMessages: SwaggerErrorMessages.groups.getMembers.notFound,
    auth: true,
  })
  @Permission([Permissions.Groups.Read])
  @ResponseMessage(SuccessMessages.groups.GET_MEMBERS)
  @Get("/group-member/:groupId")
  async getGroupMembers(
    @Param("groupId") groupId: string,
    @CurrentUser() user: UserAggregate,
  ): Promise<void> {
    // console.log(data)
    const query = new GetMembersQuery({ groupId: groupId, userId: user.id })
    return await this.service.getMembers(query)
  }
}
