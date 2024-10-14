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
import { CreateCategoryCommand } from "./create-category.command"

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler {
  constructor(
    private readonly categoryRepository: ICategoriesRepository,
    private readonly categoryCacheRepository: CategoriesRedisRepository,
  ) {}
  async execute(command: CreateCategoryCommand): Promise<void> {
    const { name, image, applicableTo } = command
    try {
      if (!name || name.length === 0) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: "Data from client can not be empty",
          info: {
            errorCode: QueryErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
          },
        })
      }
      if (!image || image.length === 0) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: "Data from client can not be empty",
          info: {
            errorCode: QueryErrorDetailCode.ID_CAN_NOT_BE_EMPTY,
          },
        })
      }

      const category = CategoriesFactory.createCategory({
        name,
        image,
        applicableTo,
      })
      await Promise.all([
        this.categoryRepository.addCategory(category),
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
