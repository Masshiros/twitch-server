import { CommandHandler } from "@nestjs/cqrs"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { InfrastructureError } from "libs/exception/infrastructure"
import { UserAggregate } from "src/module/users/domain/aggregate"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { SetStreamInfoCommand } from "./set-stream-info.command"

@CommandHandler(SetStreamInfoCommand)
export class SetStreamInfoHandler {
  constructor(private readonly userRepository: IUserRepository) {}
  async execute(command: SetStreamInfoCommand) {
    const { userId, title, categoryIds, tagsIds } = command
    try {
      if (!userId && userId.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "User id can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.UPDATE_USER_ID_CAN_NOT_BE_EMPTY,
          },
        })
      }

      if (!title && title.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Title can not be empty",
        })
      }
      const user: UserAggregate | null =
        await this.userRepository.findById(userId)
      if (!user) {
        throw new CommandError({
          code: CommandErrorCode.NOT_FOUND,
          message: "User not found",
          info: {
            errorCode: CommandErrorDetailCode.USER_NOT_FOUND,
          },
        })
      }
      const livestreamInfo = await this.userRepository.getStreamInfoByUser(user)
      if (!livestreamInfo) {
        throw new CommandError({
          code: CommandErrorCode.NOT_FOUND,
          message: "Livestream info not found",
          info: {
            errorCode: CommandErrorDetailCode.USER_NOT_FOUND,
          },
        })
      }
      if (livestreamInfo.userId !== user.id) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "This livestream is not belong to you",
        })
      }
      if (title) {
        livestreamInfo.title = title
      }
      if (categoryIds && categoryIds.length > 0) {
        await this.userRepository.setLiveStreamInfoCategories(
          user.id,
          categoryIds,
        )
      }
      if (tagsIds && tagsIds.length > 0) {
        await this.userRepository.setLiveStreamInfoTags(user.id, tagsIds)
      }
      await this.userRepository.updateStreamInfoOfUser(livestreamInfo)
    } catch (err) {
      if (err instanceof CommandError || err instanceof InfrastructureError) {
        throw err
      }

      throw new CommandError({
        code: CommandErrorCode.INTERNAL_SERVER_ERROR,
        message: err.message,
      })
    }
  }
}
