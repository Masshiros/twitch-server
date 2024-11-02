import { CommandHandler } from "@nestjs/cqrs"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { ICategoriesRepository } from "src/module/categories/domain/repository/categories.interface.repository"
import { CategoriesRedisRepository } from "src/module/categories/infrastructure/database/redis/categories.redis.repository"
import { DeleteCategoryCommand } from "./delete-category.command"

@CommandHandler(DeleteCategoryCommand)
export class DeleteCategoryHandler {
  constructor(
    private readonly categoryRepository: ICategoriesRepository,
    private readonly categoryCacheRepository: CategoriesRedisRepository,
  ) {}
  async execute(command: DeleteCategoryCommand) {
    try {
      const { categoryId } = command
      if (!categoryId) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Id can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.ID_CAN_NOT_BE_EMPTY,
          },
        })
      }
      const category = await this.categoryRepository.getCategoryById(categoryId)
      if (!category) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Category not found",
          info: {
            errorCode: CommandErrorDetailCode.NOT_FOUND,
          },
        })
      }
      category.deletedAt = new Date()
      await Promise.all([
        this.categoryRepository.updateCategory(category),
        this.categoryCacheRepository.invalidateCache(),
      ])
    } catch (err) {
      if (
        err instanceof DomainError ||
        err instanceof CommandError ||
        err instanceof InfrastructureError
      ) {
        throw err
      }

      throw new CommandError({
        code: CommandErrorCode.INTERNAL_SERVER_ERROR,
        message: err.message,
      })
    }
  }
}
