// src/module/groups/infrastructure/mappers/groupMemberMapper.ts

import { GroupMember as PrismaGroupMember } from "@prisma/client"
import { GroupMember } from "src/module/groups/domain/entity/group-members.entity"
import { EGroupRole } from "src/module/groups/domain/enum/group-role.enum"

export class GroupMemberMapper {
  // Convert Prisma GroupMember to Domain GroupMember
  static toDomain(prismaGroupMember: PrismaGroupMember): GroupMember {
    return new GroupMember({
      groupId: prismaGroupMember.groupId,
      memberId: prismaGroupMember.memberId,
      joinedAt: prismaGroupMember.joinedAt,
      role: prismaGroupMember.role as EGroupRole,
      createdAt: prismaGroupMember.createdAt,
      updatedAt: prismaGroupMember.updatedAt,
      deletedAt: prismaGroupMember.deletedAt || null,
    })
  }

  // Convert Domain GroupMember to Prisma GroupMember
  static toPersistence(domainGroupMember: GroupMember): PrismaGroupMember {
    return {
      groupId: domainGroupMember.groupId,
      memberId: domainGroupMember.memberId,
      joinedAt: domainGroupMember.joinedAt,
      role: domainGroupMember.role,
      createdAt: domainGroupMember.createdAt,
      updatedAt: domainGroupMember.updatedAt,
      deletedAt: domainGroupMember.deletedAt,
    }
  }
}
