import { CommandHandler } from "@nestjs/cqrs"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { CategoriesFactory } from "src/module/categories/domain/factory/categories.factory"
import { ICategoriesRepository } from "src/module/categories/domain/repository/categories.interface.repository"
import { CreateTagCommand } from "./create-tag.command"

@CommandHandler(CreateTagCommand)
export class CreateTagHandler {
  constructor(private readonly categoryRepository: ICategoriesRepository) {}
  async execute(command: CreateTagCommand) {
    const { name, applicableTo } = command
    try {
      if (!name || name.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.NOT_FOUND,
          message: "Data from client can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
          },
        })
      }
      const tag = CategoriesFactory.createTag({ name, applicableTo })
      await this.categoryRepository.addTag(tag)
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
