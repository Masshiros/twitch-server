import { Body, Controller, Get, Post, Query, Res } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { Permissions } from "libs/constants/permissions"
import { SuccessMessages } from "libs/constants/success"
import { ApiOperationDecorator } from "libs/decorator/api-operation.decorator"
import { CurrentUser } from "libs/decorator/current-user.decorator"
import { Permission } from "libs/decorator/permission.decorator"
import { ResponseMessage } from "libs/decorator/response-message.decorator"
import { UserAggregate } from "src/module/users/domain/aggregate"
import { ChatService } from "../application/chat.service"
import { CreateConversationCommand } from "../application/command/create-conversation/create-conversation.command"
import { CreateMessageCommand } from "../application/command/create-message/create-message.command"
import { GetConversationsQuery } from "../application/query/get-conversations/get-conversations.query"
import { CreateMessageRequestoDto } from "./http/request/create-message.request.dto"

@ApiTags("chats")
@Controller("chats")
export class ChatController {
  constructor(private readonly service: ChatService) {}
  @ApiOperationDecorator({
    summary: "Create a conversation",
    description: "Create a conversation between 2 user",
    auth: true,
  })
  @Permission([Permissions.Conversations.Create])
  @ResponseMessage(SuccessMessages.conversations.CREATE_CONVERSATION)
  @Post()
  async createConversation(
    @Query("recipientId") recipientId: string,
    @CurrentUser() user: UserAggregate,
  ) {
    const command = new CreateConversationCommand({
      creatorId: user.id,
      recipientId,
    })
    await this.service.createConversation(command)
  }

  @ApiOperationDecorator({
    summary: "Get all conversation",
    description: "Get all conversation",
    auth: true,
  })
  @ResponseMessage(SuccessMessages.conversations.GET_CONVERSATION)
  @Permission([Permissions.Conversations.Read])
  @Get("all-conversations")
  async getAllConversations(@CurrentUser() user: UserAggregate) {
    const query = new GetConversationsQuery({ userId: user.id })
    return await this.service.getConversations(query)
  }
  @ApiOperationDecorator({
    summary: "Create message",
    description: "Create message to conversation",
    auth: true,
  })
  @ResponseMessage(SuccessMessages.messages.CREATE_MESSAGE)
  @Permission([Permissions.Messages.Create])
  @Post("send-message/:conversationId")
  async sendMessage(
    @Query("conversationId") conversationId: string,
    @Body() body: CreateMessageRequestoDto,
    @CurrentUser() user: UserAggregate,
  ) {
    const command = new CreateMessageCommand({
      ...body,
      conversationId,
      userId: user.id,
    })
    await this.service.createMessage(command)
  }
}
