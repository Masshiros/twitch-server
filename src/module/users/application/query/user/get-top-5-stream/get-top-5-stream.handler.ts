import { QueryHandler } from "@nestjs/cqrs"
import {
  QueryError,
  QueryErrorCode,
  QueryErrorDetailCode,
} from "libs/exception/application/query"
import { InfrastructureError } from "libs/exception/infrastructure"
import { LiveStreamInfo } from "src/module/users/domain/entity/live-stream-info.entity"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { LiveStreamInfoResult } from "../get-all-stream/get-all-stream.result"
import { GetTop5StreamQuery } from "./get-top-5-stream.query"
import { GetTop5StreamResult } from "./get-top-5-stream.result"

@QueryHandler(GetTop5StreamQuery)
export class GetTop5StreamHandler {
  constructor(private readonly userRepository: IUserRepository) {}
  async execute(query: GetTop5StreamQuery): Promise<GetTop5StreamResult> {
    try {
      const liveStreamInfos =
        await this.userRepository.getAllLivingLiveStreamInfo({})
      const liveStreamInfoList = await Promise.all(
        liveStreamInfos.map(async (e: LiveStreamInfo) => {
          const user = await this.userRepository.findById(e.userId)
          if (!user) {
            throw new QueryError({
              code: QueryErrorCode.NOT_FOUND,
              message: "User not found",
              info: {
                errorCode: QueryErrorDetailCode.USER_NOT_FOUND,
              },
            })
          }
          const [categories, tags, liveStreams] = await Promise.all([
            this.userRepository.getLiveStreamInfoCategories(e.id),
            this.userRepository.getLiveStreamInfoTags(e.id),
            this.userRepository.getAllStreamSessions(user),
          ])
          const totalViews = liveStreams.reduce(
            (acc, stream) => acc + stream.totalView,
            4,
          )
          const liveStreamInfo: LiveStreamInfoResult = {
            id: e.id,
            userId: user?.id ?? "",
            userName: user?.name ?? "",
            userSlug: user?.slug ?? "",
            title: e.title ?? "",
            isLive: e.isLive ?? true,
            totalView: totalViews,
            livestreamCategorieNames: categories
              .map((e) => e.name)
              .filter((e) => e !== null),
            livestreamTagsNames: tags
              .map((e) => e.name)
              .filter((e) => e !== null),
          }
          return liveStreamInfo
        }),
      )
      const sortedLiveStreamInfoList = liveStreamInfoList.sort(
        (a, b) => b.totalView - a.totalView,
      )
      const result = sortedLiveStreamInfoList.slice(0, 5)
      return { liveStreams: result }
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
