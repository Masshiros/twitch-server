import { ETag as PrismaETag, Tag as PrismaTag } from "@prisma/client"
import { Tag } from "src/module/categories/domain/entity/tags.entity"
import { ETag as DomainETag } from "src/module/categories/domain/enum/tags.enum"

export class TagMapper {
  // Convert Prisma Tag to Domain Tag entity
  static toDomain(prismaTag: PrismaTag): Tag {
    return new Tag(
      {
        name: prismaTag.name,
        slug: prismaTag.slug,
        applicableTo: this.mapPrismaToDomainEnum(prismaTag.applicableTo),
        createdAt: prismaTag.createdAt,
        updatedAt: prismaTag.updatedAt,
        deletedAt: prismaTag.deletedAt,
      },
      prismaTag.id,
    )
  }

  static toPersistence(domainTag: Tag): PrismaTag {
    return {
      id: domainTag.id,
      name: domainTag.name,
      slug: domainTag.slug,
      applicableTo: this.mapDomainToPrismaEnum(domainTag.applicableTo),
      createdAt: domainTag.createdAt,
      updatedAt: domainTag.updatedAt,
      deletedAt: domainTag.deletedAt,
    }
  }

  private static mapPrismaToDomainEnum(prismaEnum: PrismaETag): DomainETag {
    switch (prismaEnum) {
      case PrismaETag.CATEGORY:
        return DomainETag.CATEGORY
      case PrismaETag.LIVESTREAM:
        return DomainETag.LIVESTREAM
      default:
        throw new Error(`Unknown Prisma Enum value: ${prismaEnum}`)
    }
  }

  private static mapDomainToPrismaEnum(domainEnum: DomainETag): PrismaETag {
    switch (domainEnum) {
      case DomainETag.CATEGORY:
        return PrismaETag.CATEGORY
      case DomainETag.LIVESTREAM:
        return PrismaETag.LIVESTREAM
      default:
        throw new Error(`Unknown Domain Enum value: ${domainEnum}`)
    }
  }
}
