import { CommandHandler } from "@nestjs/cqrs"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { InfrastructureError } from "libs/exception/infrastructure"
import { UserAggregate } from "src/module/users/domain/aggregate"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { UpdateLivestreamSessionCommand } from "./update-livestream-session.command"

@CommandHandler(UpdateLivestreamSessionCommand)
export class UpdateLivestreamSessionHandler {
  constructor(private readonly userRepository: IUserRepository) {}
  async execute(command: UpdateLivestreamSessionCommand) {
    const { ingressId, userId, streamAt, endStreamAt, totalView, isLive } =
      command
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
      if (!ingressId && ingressId.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Ingress id can not be empty",
        })
      }
      if (!streamAt) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "StreamAt can not be empty",
        })
      }

      if (!endStreamAt) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "endStreamAt can not be empty",
        })
      }
      if (!totalView) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "totalView can not be empty",
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
      const liveStreamInfo = await this.userRepository.getStreamInfoByUser(user)
      if (!liveStreamInfo) {
        throw new CommandError({
          code: CommandErrorCode.NOT_FOUND,
          message: "Livestream info not found",
          info: {
            errorCode: CommandErrorDetailCode.USER_NOT_FOUND,
          },
        })
      }
      liveStreamInfo.isLive = isLive
      const liveStream =
        await this.userRepository.findLivestreamByIngressId(ingressId)
      if (!liveStream) {
        throw new CommandError({
          code: CommandErrorCode.NOT_FOUND,
          message: "Livestream not found",
          info: {
            errorCode: CommandErrorDetailCode.USER_NOT_FOUND,
          },
        })
      }
      liveStream.startStreamAt = streamAt
      liveStream.endStreamAt = endStreamAt
      await Promise.all([
        this.userRepository.updateLivestream(liveStream),
        this.userRepository.updateLivestreamInfo(liveStreamInfo),
      ])
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
