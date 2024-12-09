import { Injectable } from "@nestjs/common"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { CreateConversationCommand } from "./command/create-conversation/create-conversation.command"
import { CreateMessageCommand } from "./command/create-message/create-message.command"
import { DeleteMessageCommand } from "./command/delete-message/delete-message.command"
import { UpdateMessageCommand } from "./command/update-message/update-message.command"
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
  async updateMessage(command: UpdateMessageCommand) {
    return this.commandBus.execute(command)
  }
  async deleteMessage(command: DeleteMessageCommand) {
    return this.commandBus.execute(command)
  }
}
