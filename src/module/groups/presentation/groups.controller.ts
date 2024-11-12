import {
  Body,
  Controller,
  Param,
  Post,
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
import { AddCoverImageCommand } from "../application/command/add-cover-image/add-cover-image.command"
import { AddDescriptionCommand } from "../application/command/add-description/add-description.command"
import { CreateGroupCommand } from "../application/command/create-group/create-group.command"
import { GroupsService } from "../application/groups.service"
import { AddCoverImageRequestDto } from "./http/dto/request/add-cover-image.request.dto"
import { AddDescriptionRequestDto } from "./http/dto/request/add-description.request.dto"
import { CreateGroupRequestDto } from "./http/dto/request/create-group.request.dto"

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
}
