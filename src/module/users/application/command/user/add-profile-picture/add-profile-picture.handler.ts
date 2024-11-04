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
import { EImage } from "src/module/image/domain/enum/image.enum"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { AddProfilePictureCommand } from "./add-profile-picture.command"

@CommandHandler(AddProfilePictureCommand)
export class AddProfilePictureHandler {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly imageService: ImageService,
  ) {}
  async execute(command: AddProfilePictureCommand): Promise<void> {
    const { userId, picture } = command
    try {
      if (!userId || userId.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Data from client can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
          },
        })
      }
      if (!picture) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Data from client can not be empty",
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
      await this.imageService.uploadImage(
        picture,
        Folder.image.user,
        userId,
        EImage.USER,
      )
    } catch (error) {
      console.error(error.stack)
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
