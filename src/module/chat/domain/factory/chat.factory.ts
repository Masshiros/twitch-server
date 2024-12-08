import { Conversation } from "../entity/conversation.entity"
import { Message } from "../entity/message.entity"

interface ConversationCreationProps {
  id?: string
  creatorId: string
  receiverId: string
  lastMessageId?: string
}

interface MessageCreationProps {
  id?: string
  conversationId: string
  authorId: string
  content: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

export class ChatFactory {
  static createConversation(props: ConversationCreationProps): Conversation {
    return new Conversation({
      id: props.id,
      creatorId: props.creatorId,
      receiverId: props.receiverId,
      lastMessageId: props.lastMessageId,
      createdAt: new Date(),
    })
  }

  static createMessage(props: MessageCreationProps): Message {
    return new Message({
      id: props.id,
      conversationId: props.conversationId,
      authorId: props.authorId,
      content: props.content,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt,
      deletedAt: props.deletedAt,
    })
  }
}
