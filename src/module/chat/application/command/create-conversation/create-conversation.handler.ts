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
import { ConversationCreateEvent } from "src/module/chat/domain/events/conversation/conversation-create.event"
import { ChatFactory } from "src/module/chat/domain/factory/chat.factory"
import { IChatRepository } from "src/module/chat/domain/repository/chat.interface.repository"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { CreateConversationCommand } from "./create-conversation.command"

@CommandHandler(CreateConversationCommand)
export class CreateConversationHandler {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly chatRepository: IChatRepository,
    private readonly events: EventEmitter2,
  ) {}
  async execute(command: CreateConversationCommand) {
    const { creatorId, recipientId } = command
    try {
      if (!creatorId) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "CreatorId can not be empty",
        })
      }
      if (!recipientId) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "recipientId can not be empty",
        })
      }

      const [creator, recipient] = await Promise.all([
        this.userRepository.findById(creatorId),
        this.userRepository.findById(recipientId),
      ])
      if (!creator) {
        throw new CommandError({
          code: CommandErrorCode.NOT_FOUND,
          message: "Creator not found",
          info: {
            errorCode: CommandErrorDetailCode.USER_NOT_FOUND,
          },
        })
      }
      if (!recipient) {
        throw new CommandError({
          code: CommandErrorCode.NOT_FOUND,
          message: "Recipient not found",
          info: {
            errorCode: CommandErrorDetailCode.USER_NOT_FOUND,
          },
        })
      }

      const conversation = ChatFactory.createConversation({
        creatorId,
        receiverId: recipientId,
      })

      if (!conversation) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Cannot create conversation.Try again later",
          info: {
            errorCode: CommandErrorDetailCode.SOMETHING_WRONG_HAPPEN,
          },
        })
      }
      await this.chatRepository.createConversation(conversation)
      this.events.emit(
        Events.conversation.create,
        new ConversationCreateEvent(conversation),
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
