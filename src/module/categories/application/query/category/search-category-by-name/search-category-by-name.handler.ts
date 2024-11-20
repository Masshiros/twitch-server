import { QueryHandler } from "@nestjs/cqrs"
import {
  QueryError,
  QueryErrorCode,
  QueryErrorDetailCode,
} from "libs/exception/application/query"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { ICategoriesRepository } from "src/module/categories/domain/repository/categories.interface.repository"
import { CategoryResult } from "../category.result"
import { SearchCategoryByNameQuery } from "./search-category-by-name.query"

@QueryHandler(SearchCategoryByNameQuery)
export class SearchCategoryByNameHandler {
  constructor(private readonly categoryRepository: ICategoriesRepository) {}
  async execute(query: SearchCategoryByNameQuery): Promise<CategoryResult[]> {
    const { keyword } = query
    try {
      if (!keyword || keyword.length === 0) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: "Keyword can not be empty",
          info: {
            errorCode: QueryErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
            field: "keyword",
          },
        })
      }
      const categories =
        await this.categoryRepository.searchCategoriesByKeyword(keyword)
      if (!categories) {
        return []
      }
      const result = await Promise.all(
        categories.map(async (c) => {
          const tags = await this.categoryRepository.getTagsByCategory(c)
          return {
            id: c.id,
            name: c.name,
            slug: c.slug,
            currentTotalView: c.currentTotalView,
            image: c.image,
            tags: tags ?? [],
          }
        }),
      )
      return result
    } catch (err) {
      if (
        err instanceof DomainError ||
        err instanceof QueryError ||
        err instanceof InfrastructureError
      ) {
        throw err
      }

      throw new QueryError({
        code: QueryErrorCode.INTERNAL_SERVER_ERROR,
        message: err.message,
      })
    }
  }
}
