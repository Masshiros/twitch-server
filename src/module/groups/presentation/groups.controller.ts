import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
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
import { AddCoverImageCommand } from "../application/command/add-cover-image/add-cover-image.command"
import { AddDescriptionCommand } from "../application/command/add-description/add-description.command"
import { CreateGroupCommand } from "../application/command/create-group/create-group.command"
import { InviteMembersCommand } from "../application/command/invite-members/invite-members.command"
import { RejectInvitationCommand } from "../application/command/reject-invitation/reject-invitation.command"
import { GroupsService } from "../application/groups.service"
import { GetGroupQuery } from "../application/query/get-group/get-group.query"
import { GetJoinedGroupQuery } from "../application/query/get-joined-groups/get-joined-groups.query"
import { GetManageGroupQuery } from "../application/query/get-manage-groups/get-manage-groups.query"
import { AddCoverImageRequestDto } from "./http/dto/request/add-cover-image.request.dto"
import { AddDescriptionRequestDto } from "./http/dto/request/add-description.request.dto"
import { CreateGroupRequestDto } from "./http/dto/request/create-group.request.dto"
import { GetJoinedGroupsRequestDto } from "./http/dto/request/get-joined-groups.request.dto"
import { GetManageGroupRequestDto } from "./http/dto/request/get-manage-group.request.dto"
import { InviteMembersRequestDto } from "./http/dto/request/invite-members.request.dto"
import { GetGroupResponseDto } from "./http/dto/response/get-group.response.dto"
import { GetJoinedGroupResponseDto } from "./http/dto/response/get-joined-group.response.dto"
import { GetManageGroupResponseDto } from "./http/dto/response/get-manage-group.response.dto"

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
    await this.service.addDescription(command)
  }
  // Post: Invite members
  @ApiOperationDecorator({
    summary: "Add description to a group",
    description: "Add a description to group by admin",
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
    await this.service.rejectInvitation(command)
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
  @Permission([Permissions.Groups.Read])
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
}
