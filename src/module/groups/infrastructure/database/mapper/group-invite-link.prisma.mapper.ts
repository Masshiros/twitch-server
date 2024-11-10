import { GroupInviteLink as PrismaGroupInviteLink } from "@prisma/client"
import { GroupInviteLink } from "src/module/groups/domain/entity/group-invite-links.entity"

export class GroupInviteLinkMapper {
  // Convert Prisma GroupInviteLink to Domain GroupInviteLink
  static toDomain(prismaInviteLink: PrismaGroupInviteLink): GroupInviteLink {
    return new GroupInviteLink({
      id: prismaInviteLink.id,
      groupId: prismaInviteLink.groupId,
      link: prismaInviteLink.link,
      expiresAt: prismaInviteLink.expiresAt,
      maxUses: prismaInviteLink.maxUses,
      currentUses: prismaInviteLink.currentUses,
      createdAt: prismaInviteLink.createdAt,
    })
  }

  // Convert Domain GroupInviteLink to Prisma GroupInviteLink
  static toPersistence(
    domainInviteLink: GroupInviteLink,
  ): PrismaGroupInviteLink {
    return {
      id: domainInviteLink.id,
      groupId: domainInviteLink.groupId,
      link: domainInviteLink.link,
      expiresAt: domainInviteLink.expiresAt,
      maxUses: domainInviteLink.maxUses,
      currentUses: domainInviteLink.currentUses,
      createdAt: domainInviteLink.createdAt,
    }
  }
}
