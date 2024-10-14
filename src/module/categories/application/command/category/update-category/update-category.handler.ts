import { CommandHandler } from "@nestjs/cqrs"
import {
  QueryError,
  QueryErrorCode,
  QueryErrorDetailCode,
} from "libs/exception/application/query"
import { InfrastructureError } from "libs/exception/infrastructure"
import { CategoriesFactory } from "src/module/categories/domain/factory/categories.factory"
import { ICategoriesRepository } from "src/module/categories/domain/repository/categories.interface.repository"
import { CategoriesRedisRepository } from "src/module/categories/infrastructure/database/redis/categories.redis.repository"
import { UpdateCategoryCommand } from "./update-category.command"

@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryHandler {
  constructor(
    private readonly categoryRepository: ICategoriesRepository,
    private readonly categoryCacheRepository: CategoriesRedisRepository,
  ) {}
  async execute(command: UpdateCategoryCommand) {
    const { categoryId, name, image } = command
    try {
      if (!categoryId) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: "Id can not be empty",
          info: {
            errorCode: QueryErrorDetailCode.ID_CAN_NOT_BE_EMPTY,
          },
        })
      }
      const category = await this.categoryRepository.getCategoryById(categoryId)
      if (!category) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: "Category not found",
          info: {
            errorCode: QueryErrorDetailCode.NOT_FOUND,
          },
        })
      }
      const updatedCategory = CategoriesFactory.createCategory({
        id: category.id,
        name,
        image,
      })
      updatedCategory.updatedAt = new Date()
      await Promise.all([
        this.categoryRepository.updateCategory(updatedCategory),
        this.categoryCacheRepository.invalidateCache(),
      ])
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
