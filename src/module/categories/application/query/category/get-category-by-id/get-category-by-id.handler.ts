import { QueryHandler } from "@nestjs/cqrs"
import {
  QueryError,
  QueryErrorCode,
  QueryErrorDetailCode,
} from "libs/exception/application/query"
import { InfrastructureError } from "libs/exception/infrastructure"
import { ICategoriesRepository } from "src/module/categories/domain/repository/categories.interface.repository"
import { CategoryResult } from "../../category.result"
import { GetCategoryByIdQuery } from "./get-category-by-id.query"

@QueryHandler(GetCategoryByIdQuery)
export class GetCategoryByIdHandler {
  constructor(private readonly categoryRepository: ICategoriesRepository) {}
  async execute(query: GetCategoryByIdQuery): Promise<CategoryResult | null> {
    const { id } = query
    try {
      if (!id) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: "Id can not be empty",
          info: {
            errorCode: QueryErrorDetailCode.ID_CAN_NOT_BE_EMPTY,
          },
        })
      }
      const category = await this.categoryRepository.getCategoryById(id)
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
