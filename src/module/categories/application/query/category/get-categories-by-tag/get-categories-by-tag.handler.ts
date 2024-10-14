import { QueryHandler } from "@nestjs/cqrs"
import {
  QueryError,
  QueryErrorCode,
  QueryErrorDetailCode,
} from "libs/exception/application/query"
import { InfrastructureError } from "libs/exception/infrastructure"
import { Category } from "src/module/categories/domain/entity/categories.entity"
import { ICategoriesRepository } from "src/module/categories/domain/repository/categories.interface.repository"
import { CategoryResult } from "../../category.result"
import { GetCategoriesByTagQuery } from "./get-categories-by-tag.query"

@QueryHandler(GetCategoriesByTagQuery)
export class GetCategoriesByTagHandler {
  constructor(private readonly categoriesRepository: ICategoriesRepository) {}
  async execute(
    query: GetCategoriesByTagQuery,
  ): Promise<CategoryResult[] | null> {
    const { tagId } = query
    try {
      if (!tagId) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: "Data from client can not be empty",
          info: {
            errorCode: QueryErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
          },
        })
      }
      const tag = await this.categoriesRepository.getTagById(tagId)
      if (!tag) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: "Tag not found",
        })
      }
      const categories = await this.categoriesRepository.getCategoriesByTag(tag)
      if (!categories) {
        return null
      }
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
