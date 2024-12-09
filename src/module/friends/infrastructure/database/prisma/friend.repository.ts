import { Injectable } from "@nestjs/common"
import { EFriendRequestStatus, Prisma } from "@prisma/client"
import {
  InfrastructureError,
  InfrastructureErrorCode,
} from "libs/exception/infrastructure"
import { PrismaService } from "prisma/prisma.service"
import { FriendRequest } from "src/module/friends/domain/entity/friend-request.entity"
import { Friend } from "src/module/friends/domain/entity/friend.entity"
import { IFriendRepository } from "src/module/friends/domain/repository/friend.interface.repository"
import { UserAggregate } from "src/module/users/domain/aggregate"
import { ThisMonthInstance } from "twilio/lib/rest/api/v2010/account/usage/record/thisMonth"
import { handlePrismaError } from "utils/prisma-error"
import { FriendRequestMapper } from "../mapper/friend-request.prisma.mapper"
import { FriendMapper } from "../mapper/friend.prisma.mapper"

@Injectable()
export class FriendRepository implements IFriendRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async addFriend(friend: Friend): Promise<void> {
    try {
      await Promise.all([
        this.prismaService.friend.create({
          data: { userId: friend.userId, friendId: friend.friendId },
        }),
        this.prismaService.friend.create({
          data: { userId: friend.friendId, friendId: friend.userId },
        }),
      ])
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async removeFriend(friend: Friend): Promise<void> {
    try {
      await this.prismaService.friend.deleteMany({
        where: {
          OR: [
            { userId: friend.userId, friendId: friend.friendId },
            { userId: friend.friendId, friendId: friend.userId },
          ],
        },
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async getFriends(user: UserAggregate): Promise<Friend[]> {
    try {
      const friends = await this.prismaService.friend.findMany({
        where: {
          userId: user.id,
        },
      })
      if (!friends) {
        return []
      }
      const result = friends.map((f) => FriendMapper.toDomain(f))
      return result ?? []
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async getFriend(user: UserAggregate, friend: UserAggregate): Promise<Friend> {
    try {
      const existFriend = await this.prismaService.friend.findUnique({
        where: {
          userId_friendId: {
            userId: user.id,
            friendId: friend.id,
          },
        },
      })
      if (!existFriend) {
        return null
      }
      const result = FriendMapper.toDomain(existFriend)
      return result ?? null
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async isFriend(user: UserAggregate, friend: UserAggregate): Promise<boolean> {
    try {
      const count = await this.prismaService.friend.count({
        where: {
          OR: [
            { userId: user.id, friendId: friend.id },
            { userId: friend.id, friendId: user.id },
          ],
        },
      })
      return count > 0
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async getMutualFriends(
    user: UserAggregate,
    friend: UserAggregate,
  ): Promise<Friend[]> {
    try {
      const mutualFriendIds = await this.prismaService.$queryRaw<
        Array<{ friendId: string }>
      >`
      SELECT f1."friendId"
      FROM twitch."friends" AS f1
      JOIN twitch."friends" AS f2 ON f1."friendId" = f2."friendId"
      WHERE f1."userId" = '${user.id}' AND f2."userId" = '${friend.id}'
    `

      const mutualFriends = await this.prismaService.user.findMany({
        where: { id: { in: mutualFriendIds.map((record) => record.friendId) } },
      })
      return mutualFriends.map(
        (mutualFriend) =>
          new Friend({
            userId: user.id,
            friendId: mutualFriend.id,
            createdAt: mutualFriend.createdAt,
            updatedAt: mutualFriend.updatedAt,
            deletedAt: mutualFriend.deletedAt,
          }),
      )
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async sendFriendRequest(request: FriendRequest): Promise<void> {
    try {
      const data = FriendRequestMapper.toPersistence(request)
      const existingFriendRequest =
        await this.prismaService.friendRequest.findUnique({
          where: {
            senderId_receiverId: {
              senderId: data.senderId,
              receiverId: data.receiverId,
            },
          },
        })
      if (existingFriendRequest) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
          message: "Already send friend request",
        })
      }
      await this.prismaService.friendRequest.create({ data })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async acceptFriendRequest(request: FriendRequest): Promise<void> {
    try {
      await this.prismaService.$transaction(async (prisma) => {
        await prisma.friendRequest.update({
          where: {
            senderId_receiverId: {
              senderId: request.senderId,
              receiverId: request.receiverId,
            },
          },
          data: {
            status: EFriendRequestStatus.ACCEPTED,
          },
        }),
          await Promise.all([
            prisma.friend.create({
              data: { userId: request.senderId, friendId: request.receiverId },
            }),
            prisma.friend.create({
              data: { userId: request.receiverId, friendId: request.senderId },
            }),
          ])
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async rejectFriendRequest(request: FriendRequest): Promise<void> {
    try {
      await this.prismaService.friendRequest.update({
        where: {
          senderId_receiverId: {
            senderId: request.senderId,
            receiverId: request.receiverId,
          },
        },
        data: {
          status: EFriendRequestStatus.REJECTED,
        },
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async getFriendRequest(
    sender: UserAggregate,
    receiver: UserAggregate,
  ): Promise<FriendRequest> {
    try {
      const friendRequest = await this.prismaService.friendRequest.findFirst({
        where: {
          OR: [
            { senderId: sender.id, receiverId: receiver.id },
            { senderId: receiver.id, receiverId: sender.id },
          ],
        },
      })
      if (!friendRequest) {
        return null
      }
      const result = FriendRequestMapper.toDomain(friendRequest)
      return result ?? null
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async getListFriendRequest(
    receiver: UserAggregate,
  ): Promise<FriendRequest[]> {
    try {
      const friendRequests = await this.prismaService.friendRequest.findMany({
        where: {
          receiverId: receiver.id,
          status: EFriendRequestStatus.PENDING,
        },
      })
      if (!friendRequests) {
        return []
      }
      const result = friendRequests.map((e) => FriendRequestMapper.toDomain(e))
      return result ?? []
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
}
