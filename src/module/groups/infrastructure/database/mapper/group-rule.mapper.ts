import { GroupRule as PrismaGroupRule } from "@prisma/client"
import { GroupRule } from "src/module/groups/domain/entity/group-rule.entity"

export class GroupRuleMapper {
  // Convert Prisma GroupRule to Domain GroupRule
  static toDomain(prismaGroupRule: PrismaGroupRule): GroupRule {
    return new GroupRule({
      id: prismaGroupRule.id,
      groupId: prismaGroupRule.groupId,
      title: prismaGroupRule.title,
      content: prismaGroupRule.content,
      createdAt: prismaGroupRule.createdAt,
      updatedAt: prismaGroupRule.updatedAt,
      deletedAt: prismaGroupRule.deletedAt || null,
    })
  }

  // Convert Domain GroupRule to Prisma GroupRule
  static toPersistence(domainGroupRule: GroupRule): PrismaGroupRule {
    return {
      id: domainGroupRule.id,
      groupId: domainGroupRule.groupId,
      title: domainGroupRule.title,
      content: domainGroupRule.content,
      createdAt: domainGroupRule.createdAt,
      updatedAt: domainGroupRule.updatedAt,
      deletedAt: domainGroupRule.deletedAt,
    }
  }
}
