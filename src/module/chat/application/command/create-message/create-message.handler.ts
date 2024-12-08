import { CommandHandler } from "@nestjs/cqrs"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { Events } from "libs/constants/events"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { MessageCreateEvent } from "src/module/chat/domain/events/message/message-create.event"
import { ChatFactory } from "src/module/chat/domain/factory/chat.factory"
import { IChatRepository } from "src/module/chat/domain/repository/chat.interface.repository"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { CreateMessageCommand } from "./create-message.command"

@CommandHandler(CreateMessageCommand)
export class CreateMessageHandler {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly chatRepository: IChatRepository,
    private readonly events: EventEmitter2,
  ) {}
  async execute(command: CreateMessageCommand) {
    const { userId, content, conversationId } = command
    try {
      if (!userId) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "UserId can not be empty",
        })
      }

      const user = await this.userRepository.findById(userId)
      if (!user) {
        throw new CommandError({
          code: CommandErrorCode.NOT_FOUND,
          message: "User not found",
          info: {
            errorCode: CommandErrorDetailCode.USER_NOT_FOUND,
          },
        })
      }

      const existConversation =
        await this.chatRepository.findConversationById(conversationId)
      if (!existConversation) {
        throw new CommandError({
          code: CommandErrorCode.NOT_FOUND,
          message: "Conversation not found",
          info: {
            errorCode: CommandErrorDetailCode.USER_NOT_FOUND,
          },
        })
      }
      console.log(existConversation)
      if (existConversation.creatorId !== userId) {
        throw new CommandError({
          code: CommandErrorCode.NOT_FOUND,
          message: "Cannot create message",
        })
      }
      const message = ChatFactory.createMessage({
        authorId: userId,
        createdAt: new Date(),
        content,
        conversationId,
      })
      if (!message) {
        throw new CommandError({
          code: CommandErrorCode.NOT_FOUND,
          message: "Cannot create message",
        })
      }
      existConversation.lastMessageId = message.id
      await Promise.all([
        this.chatRepository.createMessage(message),
        this.chatRepository.updateConversation(existConversation),
      ])
      return this.events.emit(
        Events.message.create,
        new MessageCreateEvent(message),
      )
    } catch (err) {
      if (
        err instanceof DomainError ||
        err instanceof CommandError ||
        err instanceof InfrastructureError
      ) {
        throw err
      }

      throw new CommandError({
        code: CommandErrorCode.INTERNAL_SERVER_ERROR,
        message: err.message,
      })
    }
  }
}
