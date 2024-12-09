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
import { MessageDeleteEvent } from "src/module/chat/domain/events/message/message-delete.event"
import { MessageUpdateEvent } from "src/module/chat/domain/events/message/message-update.event"
import { IChatRepository } from "src/module/chat/domain/repository/chat.interface.repository"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { DeleteMessageCommand } from "./delete-message.command"

@CommandHandler(DeleteMessageCommand)
export class DeleteMessageHandler {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly chatRepository: IChatRepository,
    private readonly events: EventEmitter2,
  ) {}
  async execute(command: DeleteMessageCommand) {
    const { messageId, userId } = command
    try {
      if (!userId || userId.length === 0) {
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
      if (!messageId || messageId.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "MessageId can not be empty",
        })
      }
      const message = await this.chatRepository.getMessageById(messageId)
      if (!message || message === undefined) {
        throw new CommandError({
          code: CommandErrorCode.NOT_FOUND,
          message: "Message not found",
        })
      }
      if (message.authorId !== userId) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "This message is not belong to you",
        })
      }

      await this.chatRepository.deleteMessage(message)
      this.events.emit(Events.message.delete, new MessageDeleteEvent(message))
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
