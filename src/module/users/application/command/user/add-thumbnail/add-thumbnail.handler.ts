import { CommandHandler } from "@nestjs/cqrs"
import { Folder } from "libs/constants/folder"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { ImageService } from "src/module/image/application/image.service"
import { EImageType } from "src/module/image/domain/enum/image-type.enum"
import { EImage } from "src/module/image/domain/enum/image.enum"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { AddThumbnailCommand } from "./add-thumbnail.command"

@CommandHandler(AddThumbnailCommand)
export class AddThumbnailHandler {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly imageService: ImageService,
  ) {}
  async execute(command: AddThumbnailCommand): Promise<void> {
    const { userId, thumbnail } = command
    try {
      if (!userId || userId.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "User id can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
          },
        })
      }
      if (!thumbnail) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Thumbnail can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
          },
        })
      }
      const user = await this.userRepository.findById(userId)
      if (!user) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Unauthorized",
          info: {
            errorCode: CommandErrorDetailCode.UNAUTHORIZED,
          },
        })
      }

      // handle user image
      const userImage = await this.imageService.getImageByApplicableId(userId)
      // userImage.forEach((i) => console.log(i.publicId))
      if (userImage.length > 0) {
        await Promise.all(
          userImage.map((i) => {
            // console.log(i.id)
            if (i.imageType === EImageType.THUMBNAIL) {
              this.imageService.removeImage(i)
            }
          }),
        )
      }
      await this.imageService.uploadImage(
        thumbnail,
        Folder.image.user,
        userId,
        EImage.USER,
        EImageType.THUMBNAIL,
      )
      const savedThumbnail =
        await this.imageService.getImageByApplicableId(userId)
      savedThumbnail.map((e) => {
        if (e.imageType === EImageType.THUMBNAIL) {
          user.thumbnail = e.url
        }
      })
      await this.userRepository.update(user)
    } catch (error) {
      if (
        error instanceof DomainError ||
        error instanceof CommandError ||
        error instanceof InfrastructureError
      ) {
        throw error
      }

      throw new CommandError({
        code: CommandErrorCode.INTERNAL_SERVER_ERROR,
        message: "Internal Server Error",
      })
    }
  }
}
