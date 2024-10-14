import { QueryHandler } from "@nestjs/cqrs"
import {
  QueryError,
  QueryErrorCode,
  QueryErrorDetailCode,
} from "libs/exception/application/query"
import { InfrastructureError } from "libs/exception/infrastructure"
import { ICategoriesRepository } from "src/module/categories/domain/repository/categories.interface.repository"
import { CategoryResult } from "../../category.result"
import { GetCategoryBySlugQuery } from "./get-category-by-slug.query"

@QueryHandler(GetCategoryBySlugQuery)
export class GetCategoryBySlugHandler {
  constructor(private readonly categoryRepository: ICategoriesRepository) {}
  async execute(query: GetCategoryBySlugQuery): Promise<CategoryResult | null> {
    const { slug } = query
    try {
      if (!slug) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: "Data from client can not be empty",
          info: {
            errorCode: QueryErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
          },
        })
      }
      const category = await this.categoryRepository.getCategoryBySlug(slug)
      if (!category) {
        return null
      }
      const tags = await this.categoryRepository.getTagsByCategory(category)
      return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        currentTotalView: category.currentTotalView,
        image: category.image,
        tags: tags || [],
      }
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
