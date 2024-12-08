import { Message as PrismaMessage } from "@prisma/client"
import { Message } from "src/module/chat/domain/entity/message.entity"

export class MessageMapper {
  static toDomain(prismaMessage: PrismaMessage): Message {
    return new Message({
      id: prismaMessage.id,
      content: prismaMessage.content,
      authorId: prismaMessage.authorId,
      conversationId: prismaMessage.conversationId,
      createdAt: prismaMessage.createdAt,
      updatedAt: prismaMessage.updatedAt,
      deletedAt: prismaMessage.deletedAt,
    })
  }

  static toPersistence(domainMessage: Message): PrismaMessage {
    return {
      id: domainMessage.id,
      content: domainMessage.content,
      authorId: domainMessage.authorId,
      conversationId: domainMessage.conversationId,
      createdAt: domainMessage.createdAt,
      updatedAt: domainMessage.updatedAt,
      deletedAt: domainMessage.deletedAt,
    }
  }
}
