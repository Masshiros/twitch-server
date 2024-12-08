import {
  Group as PrismaGroup,
  EGroupPrivacy as PrismaGroupPrivacy,
  EGroupVisibility as PrismaGroupVisibility,
} from "@prisma/client"
import { Group } from "src/module/groups/domain/entity/groups.entity"
import { EGroupPrivacy } from "src/module/groups/domain/enum/group-privacy.enum"
import { EGroupVisibility } from "src/module/groups/domain/enum/group-visibility.enum"

export class GroupMapper {
  static toDomain(prismaGroup: PrismaGroup): Group {
    return new Group({
      id: prismaGroup.id,
      ownerId: prismaGroup.ownerId,
      name: prismaGroup.name,
      description: prismaGroup.description,
      visibility: this.mapPrismaVisibilityToDomain(prismaGroup.visibility),
      privacy: this.mapPrismaPrivacyToDomain(prismaGroup.privacy),
      createdAt: prismaGroup.createdAt,
      updatedAt: prismaGroup.updatedAt,
      deletedAt: prismaGroup.deletedAt,
    })
  }

  static toPersistence(domainGroup: Group): PrismaGroup {
    return {
      id: domainGroup.id,
      ownerId: domainGroup.ownerId,
      name: domainGroup.name,
      description: domainGroup.description,
      visibility: this.mapDomainVisibilityToPrisma(domainGroup.visibility),
      privacy: this.mapDomainPrivacyToPrisma(domainGroup.privacy),
      createdAt: domainGroup.createdAt,
      updatedAt: domainGroup.updatedAt,
      deletedAt: domainGroup.deletedAt,
    }
  }

  private static mapPrismaVisibilityToDomain(
    prismaEnum: PrismaGroupVisibility,
  ): EGroupVisibility {
    switch (prismaEnum) {
      case "PUBLIC":
        return EGroupVisibility.PUBLIC
      case "PRIVATE":
        return EGroupVisibility.PRIVATE
      default:
        throw new Error(
          `Unknown Prisma Group Visibility Enum value: ${prismaEnum}`,
        )
    }
  }

  private static mapDomainVisibilityToPrisma(
    domainEnum: EGroupVisibility,
  ): PrismaGroupVisibility {
    switch (domainEnum) {
      case EGroupVisibility.PUBLIC:
        return "PUBLIC"
      case EGroupVisibility.PRIVATE:
        return "PRIVATE"
      default:
        throw new Error(
          `Unknown Domain Group Visibility Enum value: ${domainEnum}`,
        )
    }
  }

  private static mapPrismaPrivacyToDomain(
    prismaEnum: PrismaGroupPrivacy,
  ): EGroupPrivacy {
    switch (prismaEnum) {
      case "VISIBLE":
        return EGroupPrivacy.VISIBLE
      case "HIDDEN":
        return EGroupPrivacy.HIDDEN
      default:
        throw new Error(
          `Unknown Prisma Group Privacy Enum value: ${prismaEnum}`,
        )
    }
  }

  // Map Domain privacy enum to Prisma privacy enum
  private static mapDomainPrivacyToPrisma(
    domainEnum: EGroupPrivacy,
  ): PrismaGroupPrivacy {
    switch (domainEnum) {
      case EGroupPrivacy.VISIBLE:
        return "VISIBLE"
      case EGroupPrivacy.HIDDEN:
        return "HIDDEN"
      default:
        throw new Error(
          `Unknown Domain Group Privacy Enum value: ${domainEnum}`,
        )
    }
  }
}
