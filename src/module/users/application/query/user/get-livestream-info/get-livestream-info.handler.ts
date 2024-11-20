import { QueryHandler } from "@nestjs/cqrs"
import {
  QueryError,
  QueryErrorCode,
  QueryErrorDetailCode,
} from "libs/exception/application/query"
import { InfrastructureError } from "libs/exception/infrastructure"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { LiveStreamInfoResult } from "../get-all-stream/get-all-stream.result"
import { GetLivestreamInfoQuery } from "./get-livestream-info.query"

@QueryHandler(GetLivestreamInfoQuery)
export class GetLivestreamInfoHandler {
  constructor(private readonly userRepository: IUserRepository) {}
  async execute(query: GetLivestreamInfoQuery): Promise<LiveStreamInfoResult> {
    const { userId } = query
    try {
      if (!userId || userId.length === 0) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: "userId can not be empty",
        })
      }
      const user = await this.userRepository.findById(userId)
      if (!user) {
        throw new QueryError({
          code: QueryErrorCode.NOT_FOUND,
          message: "User not found",
          info: {
            errorCode: QueryErrorDetailCode.USER_NOT_FOUND,
          },
        })
      }
      const livestreamInfo = await this.userRepository.getStreamInfoByUser(user)
      const [categories, tags, liveStreams] = await Promise.all([
        this.userRepository.getLiveStreamInfoCategories(livestreamInfo.id),
        this.userRepository.getLiveStreamInfoTags(livestreamInfo.id),
        this.userRepository.getAllStreamSessions(user),
      ])
      const totalViews = liveStreams.reduce(
        (acc, stream) => acc + stream.totalView,
        4,
      )
      return {
        id: livestreamInfo.id,
        userId: user.id,
        userName: user.name,
        userSlug: user.slug,
        title: livestreamInfo.title,
        isLive: livestreamInfo.isLive,
        totalView: totalViews,
        livestreamCategorieNames: categories
          .map((e) => e.name)
          .filter((e) => e !== null),
        livestreamTagsNames: tags.map((e) => e.name).filter((e) => e !== null),
      }
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
