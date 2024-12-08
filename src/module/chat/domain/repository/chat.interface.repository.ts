import { UserAggregate } from "src/module/users/domain/aggregate"
import { Conversation } from "../entity/conversation.entity"
import { Message } from "../entity/message.entity"

export abstract class IChatRepository {
  createConversation: (data: Conversation) => Promise<void>
  getConversationsByUser: (userId: string) => Promise<Conversation[]>
  findConversationById: (
    conversationId: string,
  ) => Promise<Conversation | undefined>
  updateConversation: (conversation: Conversation) => Promise<void>
  hasAccess: (
    conversation: Conversation,
    user: UserAggregate,
  ) => Promise<boolean>
  isCreated: (
    creator: UserAggregate,
    recipient: UserAggregate,
  ) => Promise<Conversation | undefined>
  getMessageById: (messageId: string) => Promise<Message>
  createMessage: (message: Message) => Promise<void>
}
