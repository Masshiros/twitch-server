import { type Category as PrismaCategory } from "@prisma/client"
import { Category } from "src/module/categories/domain/entity/categories.entity"

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
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      deletedAt: category.deletedAt,
    }
  }
}
