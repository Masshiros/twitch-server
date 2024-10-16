import { Role as PrismaRole } from "@prisma/client"
import { Role } from "src/module/users/domain/entity/roles.entity"

export class RoleMapper {
  static toDomain(prismaRole: PrismaRole): Role {
    return new Role(
      {
        name: prismaRole.name,
        createdAt: prismaRole.createdAt,
        deletedAt: prismaRole.deletedAt,
        updatedAt: prismaRole.updatedAt,
      },
      prismaRole.id,
    )
  }

  // Convert Domain Role to Prisma Role
  static toPersistence(domainRole: Role): PrismaRole {
    return {
      id: domainRole.id,
      name: domainRole.name,
      createdAt: domainRole.createdAt,
      updatedAt: domainRole.updatedAt,
      deletedAt: domainRole.deletedAt,
    }
  }
}
