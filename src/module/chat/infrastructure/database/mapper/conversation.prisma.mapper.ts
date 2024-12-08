import { Conversation as PrismaConversation } from "@prisma/client"
import { Conversation } from "src/module/chat/domain/entity/conversation.entity"

export class ConversationMapper {
  static toDomain(prismaConversation: PrismaConversation): Conversation {
    return new Conversation({
      id: prismaConversation.id,
      creatorId: prismaConversation.creatorId,
      receiverId: prismaConversation.receiverId,
      lastMessageId: prismaConversation.lastMessageSentId,
      createdAt: prismaConversation.createdAt,
      deletedAt: prismaConversation.deletedAt,
    })
  }

  static toPersistence(domainConversation: Conversation): PrismaConversation {
    return {
      id: domainConversation.id,
      creatorId: domainConversation.creatorId,
      receiverId: domainConversation.receiverId,
      lastMessageSentId: domainConversation.lastMessageId,
      deletedAt: domainConversation.deletedAt,
      createdAt: domainConversation.createdAt,
    }
  }
}
