import { CommandHandler } from "@nestjs/cqrs"
import { Folder } from "libs/constants/folder"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { CategoriesFactory } from "src/module/categories/domain/factory/categories.factory"
import { ICategoriesRepository } from "src/module/categories/domain/repository/categories.interface.repository"
import { CategoriesRedisRepository } from "src/module/categories/infrastructure/database/redis/categories.redis.repository"
import { ImageService } from "src/module/image/application/image.service"
import { EImage } from "src/module/image/domain/enum/image.enum"
import { CreateCategoryCommand } from "./create-category.command"

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler {
  constructor(
    private readonly categoryRepository: ICategoriesRepository,
    private readonly categoryCacheRepository: CategoriesRedisRepository,
    private readonly imageService: ImageService,
  ) {}
  async execute(command: CreateCategoryCommand): Promise<void> {
    const { name, image } = command
    try {
      if (!name || name.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Category name can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
          },
        })
      }
      if (!image) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Image can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.ID_CAN_NOT_BE_EMPTY,
          },
        })
      }
      const category = CategoriesFactory.createCategory({
        name,
      })
      // handle image
      await this.imageService.uploadImage(
        image,
        Folder.image.category,
        category.id,
        EImage.CATEGORY,
      )
      const cateImage = await this.imageService.getImageByApplicableId(
        category.id,
      )
      if (cateImage.length > 0) {
        category.image = cateImage[0].url ?? ""
      }

      await Promise.all([
        this.categoryRepository.addCategory(category),
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
