import { Injectable } from "@nestjs/common"
import { Prisma } from "@prisma/client"
import {
  InfrastructureError,
  InfrastructureErrorCode,
} from "libs/exception/infrastructure"
import { PrismaService } from "prisma/prisma.service"
import { Conversation } from "src/module/chat/domain/entity/conversation.entity"
import { Message } from "src/module/chat/domain/entity/message.entity"
import { IChatRepository } from "src/module/chat/domain/repository/chat.interface.repository"
import { UserAggregate } from "src/module/users/domain/aggregate"
import { handlePrismaError } from "utils/prisma-error"
import { ConversationMapper } from "../mapper/conversation.prisma.mapper"
import { MessageMapper } from "../mapper/message.prisma.mapper"

@Injectable()
export class ChatPrismaRepository implements IChatRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createConversation(data: Conversation): Promise<void> {
    try {
      const persistenceData = ConversationMapper.toPersistence(data)

      const existingConversation =
        await this.prismaService.conversation.findFirst({
          where: {
            OR: [
              {
                creatorId: persistenceData.creatorId,
                receiverId: persistenceData.receiverId,
              },
              {
                creatorId: persistenceData.receiverId,
                receiverId: persistenceData.creatorId,
              },
            ],
          },
        })

      if (existingConversation) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
          message: "Conversation already exists",
        })
      }

      await this.prismaService.conversation.create({
        data: {
          creatorId: persistenceData.creatorId,
          receiverId: persistenceData.receiverId,
        },
      })
    } catch (error) {
      this.handleDatabaseError(error)
    }
  }

  async getConversationsByUser(userId: string): Promise<Conversation[]> {
    try {
      const conversations = await this.prismaService.conversation.findMany({
        where: {
          creatorId: userId,
        },
      })
      if (!conversations) {
        return []
      }
      return (
        conversations.map((conv) => ConversationMapper.toDomain(conv)) ?? []
      )
    } catch (error) {
      this.handleDatabaseError(error)
    }
  }
  async updateConversation(conversation: Conversation): Promise<void> {
    try {
      const persistenceData = ConversationMapper.toPersistence(conversation)

      const existingConversation =
        await this.prismaService.conversation.findFirst({
          where: {
            OR: [
              {
                creatorId: persistenceData.creatorId,
                receiverId: persistenceData.receiverId,
              },
              {
                creatorId: persistenceData.receiverId,
                receiverId: persistenceData.creatorId,
              },
            ],
          },
        })

      if (!existingConversation) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
          message: "Conversation is not exists",
        })
      }
      await this.prismaService.conversation.updateMany({
        where: {
          OR: [
            {
              creatorId: persistenceData.creatorId,
              receiverId: persistenceData.receiverId,
            },
            {
              creatorId: persistenceData.receiverId,
              receiverId: persistenceData.creatorId,
            },
          ],
        },
        data: { lastMessageSentId: persistenceData.lastMessageSentId },
      })
    } catch (error) {
      this.handleDatabaseError(error)
    }
  }
  async findConversationById(
    conversationId: string,
  ): Promise<Conversation | undefined> {
    try {
      const conversation = await this.prismaService.conversation.findUnique({
        where: { id: conversationId },
      })

      return conversation
        ? ConversationMapper.toDomain(conversation)
        : undefined
    } catch (error) {
      this.handleDatabaseError(error)
    }
  }

  async hasAccess(
    conversation: Conversation,
    user: UserAggregate,
  ): Promise<boolean> {
    try {
      const conversationData = await this.prismaService.conversation.findUnique(
        {
          where: { id: conversation.id },
          select: { creatorId: true, receiverId: true },
        },
      )

      if (!conversationData) return false

      return (
        conversationData.creatorId === user.id ||
        conversationData.receiverId === user.id
      )
    } catch (error) {
      this.handleDatabaseError(error)
    }
  }

  async isCreated(
    creator: UserAggregate,
    recipient: UserAggregate,
  ): Promise<Conversation | undefined> {
    try {
      const conversation = await this.prismaService.conversation.findFirst({
        where: {
          creatorId: creator.id,
          receiverId: recipient.id,
        },
      })

      return conversation
        ? ConversationMapper.toDomain(conversation)
        : undefined
    } catch (error) {
      this.handleDatabaseError(error)
    }
  }
  async getMessageById(messageId: string): Promise<Message> {
    try {
      const message = await this.prismaService.message.findUnique({
        where: { id: messageId },
      })
      if (!message) return null
      return MessageMapper.toDomain(message) ?? null
    } catch (error) {
      this.handleDatabaseError(error)
    }
  }
  async createMessage(message: Message): Promise<void> {
    try {
      const data = MessageMapper.toPersistence(message)
      const existMessage = await this.prismaService.message.findUnique({
        where: {
          id: data.id,
        },
      })
      console.log("message", existMessage !== null)
      if (existMessage !== null && existMessage !== undefined) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
          message: "Message already exists",
        })
      }
      await this.prismaService.message.create({ data })
    } catch (error) {
      this.handleDatabaseError(error)
    }
  }

  private handleDatabaseError(error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      handlePrismaError(error)
    }
    if (error instanceof InfrastructureError) {
      throw error
    }
    throw new InfrastructureError({
      code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
      message: error.message,
    })
  }
}
