import { QueryHandler } from "@nestjs/cqrs"
import { QueryError, QueryErrorCode } from "libs/exception/application/query"
import { InfrastructureError } from "libs/exception/infrastructure"
import { Category } from "src/module/categories/domain/entity/categories.entity"
import { ICategoriesRepository } from "src/module/categories/domain/repository/categories.interface.repository"
import { CategoriesRedisRepository } from "src/module/categories/infrastructure/database/redis/categories.redis.repository"
import { CategoryResult } from "../category.result"
import { GetAllCategoriesQuery } from "./get-all-categories.query"

@QueryHandler(GetAllCategoriesQuery)
export class GetAllCategoriesHandler {
  constructor(
    private readonly categoriesRepository: ICategoriesRepository,
    private readonly categoriesRedisRepository: CategoriesRedisRepository,
  ) {}
  async execute(
    query: GetAllCategoriesQuery,
  ): Promise<CategoryResult[] | null> {
    const { limit, offset, order, orderBy } = query
    try {
      const categoriesFromCache =
        await this.categoriesRedisRepository.getCategories(
          limit,
          offset,
          orderBy,
          order,
        )
      const mapCategoryWithTags = async (category: Category) => {
        const tags = await this.categoriesRepository.getTagsByCategory(category)
        return {
          id: category.id,
          name: category.name,
          slug: category.slug,
          currentTotalView: category.currentTotalView,
          image: category.image,
          tags: tags || [],
        }
      }
      if (categoriesFromCache) {
        const result = await Promise.all(
          categoriesFromCache.map(mapCategoryWithTags),
        )
        return result
      }
      const categories = await this.categoriesRepository.getAllCategories({
        limit,
        offset,
        orderBy,
        order,
      })
      if (!categories) {
        return null
      }
      const result = await Promise.all(categories.map(mapCategoryWithTags))
      return result ?? null
    } catch (err) {
      if (err instanceof QueryError || err instanceof InfrastructureError) {
        throw err
      }

      throw new QueryError({
        code: QueryErrorCode.INTERNAL_SERVER_ERROR,
        message: err.message,
      })
    }
  }
}
