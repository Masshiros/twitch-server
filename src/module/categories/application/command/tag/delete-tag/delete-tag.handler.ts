import { CommandHandler } from "@nestjs/cqrs"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { ICategoriesRepository } from "src/module/categories/domain/repository/categories.interface.repository"
import { DeleteTagCommand } from "./delete-tag.command"

@CommandHandler(DeleteTagCommand)
export class DeleteTagHandler {
  constructor(private readonly categoryRepository: ICategoriesRepository) {}
  async execute(command: DeleteTagCommand) {
    const { tagId } = command
    try {
      if (!tagId || tagId.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Tag id can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
          },
        })
      }
      const tag = await this.categoryRepository.getTagById(tagId)
      if (!tag) {
        throw new CommandError({
          code: CommandErrorCode.NOT_FOUND,
          message: "Tag not found",
          info: {
            errorCode: CommandErrorDetailCode.NOT_FOUND,
          },
        })
      }
      const tagsCategories =
        await this.categoryRepository.getCategoriesByTag(tag)
      if (!tagsCategories) {
        throw new CommandError({
          code: CommandErrorCode.NOT_FOUND,
          message: "Still have data refer to this record",
          info: {
            errorCode: CommandErrorDetailCode.DATA_REFER_TO_THIS_RECORD,
          },
        })
      }
      tag.deletedAt = new Date()
      await this.categoryRepository.updateTag(tag)
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
