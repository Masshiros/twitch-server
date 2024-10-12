import { ECategory, type Category as PrismaCategory } from "@prisma/client"
import { Category } from "src/module/categories/domain/entity/categories.entity"
import { ECategory as DomainECategory } from "src/module/categories/domain/enum/categories.enum"

export class CategoryMapper {
  // Convert Prisma Category entity (from DB) to Domain Category entity
  static toDomain(prismaCategory: PrismaCategory): Category {
    return new Category(
      {
        currentTotalView: prismaCategory.currentTotalView,
        numberOfFollowers: prismaCategory.numberOfFollowers,
        name: prismaCategory.name,
        slug: prismaCategory.slug,
        image: prismaCategory.image,
        applicableTo: this.mapPrismaToDomainEnum(prismaCategory.applicableTo),

        createdAt: prismaCategory.createdAt,
        updatedAt: prismaCategory.updatedAt,
        deletedAt: prismaCategory.deletedAt,
      },
      prismaCategory.id,
    )
  }

  // Convert Domain Category entity to Prisma persistence format (for DB)
  static toPersistence(category: Category): PrismaCategory {
    return {
      id: category.id,
      currentTotalView: category.currentTotalView,
      numberOfFollowers: category.numberOfFollowers,
      name: category.name,
      slug: category.slug,
      image: category.image,
      applicableTo: this.mapDomainToPrismaEnum(category.applicableTo),
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      deletedAt: category.deletedAt,
    }
  }
  private static mapPrismaToDomainEnum(prismaEnum: ECategory): DomainECategory {
    switch (prismaEnum) {
      case "USER":
        return DomainECategory.USER
      case "LIVESTREAM":
        return DomainECategory.LIVESTREAM
      default:
        throw new Error(`Unknown Prisma Enum value: ${prismaEnum}`)
    }
  }

  // Helper: Convert Domain Enum to Prisma Enum
  private static mapDomainToPrismaEnum(domainEnum: DomainECategory): ECategory {
    switch (domainEnum) {
      case DomainECategory.USER:
        return "USER"
      case DomainECategory.LIVESTREAM:
        return "LIVESTREAM"
      default:
        throw new Error(`Unknown Domain Enum value: ${domainEnum}`)
    }
  }
}
