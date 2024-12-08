import { QueryHandler } from "@nestjs/cqrs"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { Events } from "libs/constants/events"
import {
  QueryError,
  QueryErrorCode,
  QueryErrorDetailCode,
} from "libs/exception/application/query"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { ConversationListEvent } from "src/module/chat/domain/events/conversation/conversation-list.event"
import { IChatRepository } from "src/module/chat/domain/repository/chat.interface.repository"
import { ImageService } from "src/module/image/application/image.service"
import { EImageType } from "src/module/image/domain/enum/image-type.enum"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { GetConversationsQuery } from "./get-conversations.query"
import { GetConversationsResult } from "./get-conversations.result"

@QueryHandler(GetConversationsQuery)
export class GetConversationsHandler {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly chatRepository: IChatRepository,
    private readonly imageService: ImageService,
    private readonly emitter: EventEmitter2,
  ) {}
  async execute(query: GetConversationsQuery): Promise<GetConversationsResult> {
    const { userId } = query
    try {
      if (!userId) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: "User id can not be empty",
        })
      }
      const user = await this.userRepository.findById(userId)
      if (!user) {
        throw new QueryError({
          code: QueryErrorCode.NOT_FOUND,
          message: "User not found",
        })
      }
      const conversations =
        await this.chatRepository.getConversationsByUser(userId)
      if (!conversations) {
        return { conversation: [] }
      }
      const result = await Promise.all(
        conversations.map(async (e) => {
          let receiver
          let lastMessage
          if (
            e.lastMessageId &&
            e.lastMessageId.length !== 0 &&
            e.lastMessageId !== undefined
          ) {
            ;[receiver, lastMessage] = await Promise.all([
              this.userRepository.findById(e.receiverId),
              this.chatRepository.getMessageById(e.lastMessageId),
            ])
          } else {
            receiver = await this.userRepository.findById(e.receiverId)
            lastMessage = null
          }

          const receiverImages = await this.imageService.getImageByApplicableId(
            receiver?.id,
          )
          const receiverAvatar = receiverImages.find(
            (e) => e.imageType === EImageType.AVATAR,
          )
          return {
            id: e.id,
            receiver: {
              id: receiver?.id,
              username: receiver?.name,
              userAvatar: receiverAvatar?.url,
              isOnline: receiver?.isOnline,
            },
            lastMessage: lastMessage?.content,
            lastMessageSentAt: lastMessage?.createdAt,
          }
        }),
      )
      this.emitter.emit(
        Events.conversation.list,
        new ConversationListEvent({ conversation: result }),
      )
      return { conversation: result }
    } catch (err) {
      if (
        err instanceof DomainError ||
        err instanceof QueryError ||
        err instanceof InfrastructureError
      ) {
        throw err
      }

      throw new QueryError({
        code: QueryErrorCode.INTERNAL_SERVER_ERROR,
        message: err.message,
      })
    }
  }
}
