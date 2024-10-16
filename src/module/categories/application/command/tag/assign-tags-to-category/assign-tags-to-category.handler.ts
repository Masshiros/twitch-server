import { CommandHandler } from "@nestjs/cqrs"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { ICategoriesRepository } from "src/module/categories/domain/repository/categories.interface.repository"
import { AssignTagsToCategoryCommand } from "./assign-tags-to-category.command"

@CommandHandler(AssignTagsToCategoryCommand)
export class AssignTagsToCategoryHandler {
  constructor(private readonly categoryRepository: ICategoriesRepository) {}
  async execute(command: AssignTagsToCategoryCommand) {
    const { tagsId, categoryId } = command
    try {
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
      const tags = await Promise.all(
        tagsId.map(async (e) => {
          const tag = await this.categoryRepository.getTagById(e)

          if (!tag) {
            throw new CommandError({
              code: CommandErrorCode.BAD_REQUEST,
              message: `Tag with id: ${e} not found`,
              info: {
                errorCode: CommandErrorDetailCode.NOT_FOUND,
              },
            })
          }
          return tag
        }),
      )
      await this.categoryRepository.assignTagsToCategory(tags, category)
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
