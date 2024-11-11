import {
  GroupInvitation as PrismaGroupInvitation,
  EInvitationStatus as PrismaInvitationStatus,
} from "@prisma/client"
import { GroupInvitation } from "src/module/groups/domain/entity/group-invitations.entity"
import { EInvitationStatus } from "src/module/groups/domain/enum/group-invitation-status.enum"

export class GroupInvitationMapper {
  // Convert Prisma GroupInvitation to Domain GroupInvitation
  static toDomain(prismaInvitation: PrismaGroupInvitation): GroupInvitation {
    return new GroupInvitation({
      id: prismaInvitation.id,
      groupId: prismaInvitation.groupId,
      invitedUserId: prismaInvitation.invitedUserId,
      inviterId: prismaInvitation.inviterId,
      status: this.mapPrismaStatusToDomain(prismaInvitation.status),
      createdAt: prismaInvitation.createdAt,
      deletedAt: prismaInvitation.deletedAt,
      updatedAt: prismaInvitation.createdAt,
      expiredAt: prismaInvitation.expiredAt,
    })
  }

  static toPersistence(
    domainInvitation: GroupInvitation,
  ): PrismaGroupInvitation {
    return {
      id: domainInvitation.id,
      groupId: domainInvitation.groupId,
      invitedUserId: domainInvitation.invitedUserId,
      inviterId: domainInvitation.inviterId,
      status: this.mapDomainStatusToPrisma(domainInvitation.status),
      createdAt: domainInvitation.createdAt,
      deletedAt: domainInvitation.deletedAt,
      updatedAt: domainInvitation.updatedAt,
      expiredAt: domainInvitation.expiredAt,
    }
  }

  private static mapPrismaStatusToDomain(
    prismaEnum: PrismaInvitationStatus,
  ): EInvitationStatus {
    switch (prismaEnum) {
      case "PENDING":
        return EInvitationStatus.PENDING
      case "ACCEPTED":
        return EInvitationStatus.ACCEPTED
      case "DECLINED":
        return EInvitationStatus.DECLINED
      case "EXPIRED":
        return EInvitationStatus.EXPIRED
      default:
        throw new Error(
          `Unknown Prisma Invitation Status Enum value: ${prismaEnum}`,
        )
    }
  }

  private static mapDomainStatusToPrisma(
    domainEnum: EInvitationStatus,
  ): PrismaInvitationStatus {
    switch (domainEnum) {
      case EInvitationStatus.PENDING:
        return "PENDING"
      case EInvitationStatus.ACCEPTED:
        return "ACCEPTED"
      case EInvitationStatus.DECLINED:
        return "DECLINED"
      case EInvitationStatus.EXPIRED:
        return "EXPIRED"
      default:
        throw new Error(
          `Unknown Domain Invitation Status Enum value: ${domainEnum}`,
        )
    }
  }
}
