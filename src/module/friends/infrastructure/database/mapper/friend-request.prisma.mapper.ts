import {
  type FriendRequest as PrismaFriendRequest,
  type EFriendRequestStatus as PrismaFriendRequestStatus,
} from "@prisma/client"
import { FriendRequest } from "src/module/friends/domain/entity/friend-request.entity"
import { EFriendRequestStatus as DomainFriendRequestStatus } from "src/module/friends/domain/enum/friend-request-status.enum"

export class FriendRequestMapper {
  // Convert Prisma FriendRequest to Domain FriendRequest
  static toDomain(prismaFriendRequest: PrismaFriendRequest): FriendRequest {
    return new FriendRequest({
      senderId: prismaFriendRequest.senderId,
      receiverId: prismaFriendRequest.receiverId,
      status: this.mapPrismaToDomainEnum(prismaFriendRequest.status),
      createdAt: prismaFriendRequest.createdAt,
      updatedAt: prismaFriendRequest.updatedAt,
      deletedAt: prismaFriendRequest.deletedAt,
    })
  }

  // Convert Domain FriendRequest to Prisma FriendRequest format
  static toPersistence(
    domainFriendRequest: FriendRequest,
  ): PrismaFriendRequest {
    return {
      senderId: domainFriendRequest.senderId,
      receiverId: domainFriendRequest.receiverId,
      status: this.mapDomainToPrismaEnum(domainFriendRequest.status),
      createdAt: domainFriendRequest.createdAt,
      updatedAt: domainFriendRequest.updatedAt,
      deletedAt: domainFriendRequest.deletedAt,
    }
  }

  // Map Prisma FriendRequestStatus enum to Domain FriendRequestStatus enum
  private static mapPrismaToDomainEnum(
    prismaEnum: PrismaFriendRequestStatus,
  ): DomainFriendRequestStatus {
    switch (prismaEnum) {
      case "PENDING":
        return DomainFriendRequestStatus.PENDING
      case "ACCEPTED":
        return DomainFriendRequestStatus.ACCEPTED
      case "REJECTED":
        return DomainFriendRequestStatus.REJECTED
      default:
        throw new Error(`Unknown Prisma Enum value: ${prismaEnum}`)
    }
  }

  // Map Domain FriendRequestStatus enum to Prisma FriendRequestStatus enum
  private static mapDomainToPrismaEnum(
    domainEnum: DomainFriendRequestStatus,
  ): PrismaFriendRequestStatus {
    switch (domainEnum) {
      case DomainFriendRequestStatus.PENDING:
        return "PENDING"
      case DomainFriendRequestStatus.ACCEPTED:
        return "ACCEPTED"
      case DomainFriendRequestStatus.REJECTED:
        return "REJECTED"
      default:
        throw new Error(`Unknown Domain Enum value: ${domainEnum}`)
    }
  }
}
