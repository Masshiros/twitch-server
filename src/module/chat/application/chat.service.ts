import { Injectable } from "@nestjs/common"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { CreateConversationCommand } from "./command/create-conversation/create-conversation.command"
import { CreateMessageCommand } from "./command/create-message/create-message.command"
import { GetConversationsQuery } from "./query/get-conversations/get-conversations.query"

@Injectable()
export class ChatService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  async createConversation(command: CreateConversationCommand) {
    return this.commandBus.execute(command)
  }
  async createMessage(command: CreateMessageCommand) {
    return this.commandBus.execute(command)
  }
  async getConversations(query: GetConversationsQuery) {
    return this.queryBus.execute(query)
  }
}
