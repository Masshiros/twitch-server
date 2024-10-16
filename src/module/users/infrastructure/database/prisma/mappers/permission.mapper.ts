import { Permission as PrismaPermission } from "@prisma/client"
import { Permission } from "src/module/users/domain/entity/permissions.entity"

export class PermissionMapper {
  // Convert Prisma Permission to Domain Permission
  static toDomain(prismaPermission: PrismaPermission): Permission {
    return new Permission(
      {
        name: prismaPermission.name,
        description: prismaPermission.description,
        createdAt: prismaPermission.createdAt,
        updatedAt: prismaPermission.updatedAt,
        deletedAt: prismaPermission.deletedAt,
      },
      prismaPermission.id,
    )
  }

  // Convert Domain Permission to Prisma Permission
  static toPersistence(domainPermission: Permission): PrismaPermission {
    return {
      id: domainPermission.id,
      name: domainPermission.name,
      description: domainPermission.description,
      createdAt: domainPermission.createdAt,
      updatedAt: domainPermission.updatedAt,
      deletedAt: domainPermission.deletedAt,
    }
  }
}
