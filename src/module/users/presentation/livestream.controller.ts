import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { Permissions } from "libs/constants/permissions"
import { SuccessMessages } from "libs/constants/success"
import { SwaggerErrorMessages } from "libs/constants/swagger-error-messages"
import { ApiOperationDecorator } from "libs/decorator/api-operation.decorator"
import { CurrentUser } from "libs/decorator/current-user.decorator"
import { Permission } from "libs/decorator/permission.decorator"
import { Public } from "libs/decorator/public.decorator"
import { ResponseMessage } from "libs/decorator/response-message.decorator"
import { SetIsLiveCommand } from "../application/command/livestream/set-is-live/set-is-live.command"
import { SetStreamInfoCommand } from "../application/command/livestream/set-stream-info/set-stream-info.command"
import { UpdateLivestreamSessionCommand } from "../application/command/livestream/update-livestream-session/update-livestream-session.command"
import { GetAllStreamQuery } from "../application/query/user/get-all-stream/get-all-stream.query"
import { GetLivestreamInfoQuery } from "../application/query/user/get-livestream-info/get-livestream-info.query"
import { GetTop5StreamQuery } from "../application/query/user/get-top-5-stream/get-top-5-stream.query"
import { UserService } from "../application/user.service"
import { UserAggregate } from "../domain/aggregate"
import { GetAllLivingStreamInfosRequestDto } from "./http/dto/request/livestream/get-all-living-stream-infos.request.dto"
import { GetLiveStreamInfoRequestDto } from "./http/dto/request/livestream/get-live-stream-info.request.dto"
import { SetIsLiveRequestDTO } from "./http/dto/request/livestream/set-is-live.request.dto"
import { SetStreamInfoRequestDto } from "./http/dto/request/livestream/set-stream-info.request.dto"
import { GetAllLivingStreamInfosResponseDto } from "./http/dto/response/livestream/get-all-living-stream-infos.response.dto"
import { GetTop5StreamResponseDto } from "./http/dto/response/livestream/get-top-5-stream.response.dto"
import { LiveStreamInfoResponseDto } from "./http/dto/response/livestream/live-stream-info.response.dto"
import { UpdateLivestreamSessionRequestDTO } from "./http/dto/response/livestream/update-livestream-session.request.dto"

@ApiTags("Livestreams")
@Controller("livestreams")
export class LiveStreamController {
  constructor(private readonly userService: UserService) {}
  // patch : set stream info
  @ApiOperationDecorator({
    type: null,
    summary: "Set stream info",
    description: "Set stream info",
    listBadRequestErrorMessages:
      SwaggerErrorMessages.stream.setStreamTitle.badRequest,
    listNotFoundErrorMessages:
      SwaggerErrorMessages.stream.setStreamTitle.notFound,
    auth: true,
  })
  @Permission([
    Permissions.LiveStreams.Create,
    Permissions.LiveStreams.Update,
    Permissions.LiveStreams.Read,
    Permissions.LiveStreams.Delete,
  ])
  @ResponseMessage(SuccessMessages.livestream.SET_STREAM_TITLE)
  @Patch("/set-info")
  async setTitle(
    @Body() data: SetStreamInfoRequestDto,
    @CurrentUser() user: UserAggregate,
  ) {
    console.log(data)
    const command = new SetStreamInfoCommand({ ...data, userId: user.id })
    await this.userService.setStreamInfo(command)
  }
  // get : get all living streams
  @ApiOperationDecorator({
    summary: "Get all living stream info",
    description: "Get all living stream info",
  })
  @Public()
  @ResponseMessage(SuccessMessages.livestream.GET_ALL_LIVING_STREAM)
  @Get("all-living-streams")
  async getAllLivingStreams(
    @Param() param: GetAllLivingStreamInfosRequestDto,
  ): Promise<GetAllLivingStreamInfosResponseDto> {
    const query = new GetAllStreamQuery({ ...param })
    query.limit = param.limit ?? 5
    query.offset = param.page ? (param.page - 1) * param.limit : null
    return await this.userService.getAllLivingStreamInfo(query)
  }
  // get: get top 5 stream info
  @ApiOperationDecorator({
    summary: "Get top 5 stream info",
    description: "Get top 5 stream info",
  })
  @Public()
  @ResponseMessage(SuccessMessages.livestream.GET_TOP_5_STREAM)
  @Get("top-5-stream")
  async getTop5LivingStreams(): Promise<GetTop5StreamResponseDto> {
    const query = new GetTop5StreamQuery()
    return await this.userService.getTop5Stream(query)
  }
  // post: set is live
  @ApiOperationDecorator({
    summary: "Set stream is live",
    description: "Set stream is live",
    auth: true,
  })
  @ResponseMessage(SuccessMessages.livestream.SET_IS_LIVE)
  @Post("set-live")
  async setIsLive(
    @Body() body: SetIsLiveRequestDTO,
    @CurrentUser() user: UserAggregate,
  ) {
    const command = new SetIsLiveCommand({ ...body, userId: user.id })
    await this.userService.setIsLive(command)
  }
  // patch: livestream update
  @ApiOperationDecorator({
    summary: "Update livestream session",
    description: "Update livestream session",
    auth: true,
  })
  @ResponseMessage(SuccessMessages.livestream.SET_IS_LIVE)
  @Patch("live-stream-session")
  async updateLivestreamSession(
    @Body() data: UpdateLivestreamSessionRequestDTO,
    @CurrentUser() user: UserAggregate,
  ) {
    const command = new UpdateLivestreamSessionCommand({
      ...data,
      userId: user.id,
    })
    await this.userService.updateLivestreamSession(command)
  }
  // get: get livestream info of user
  @ApiOperationDecorator({
    summary: "Get livestream info of user",
    description: "Get livestream info of user",
  })
  @Public()
  @ResponseMessage(SuccessMessages.livestream.GET_TOP_5_STREAM)
  @Get("livestream-info")
  async getLiveStreamInfo(
    @Body() body: GetLiveStreamInfoRequestDto,
  ): Promise<LiveStreamInfoResponseDto> {
    const query = new GetLivestreamInfoQuery({ username: body.username })
    return await this.userService.getLiveStreamInfo(query)
  }
}
