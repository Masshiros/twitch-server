import { QueryHandler } from "@nestjs/cqrs"
import {
  QueryError,
  QueryErrorCode,
  QueryErrorDetailCode,
} from "libs/exception/application/query"
import { InfrastructureError } from "libs/exception/infrastructure"
import { LiveStreamInfo } from "src/module/users/domain/entity/live-stream-info.entity"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { GetAllStreamQuery } from "./get-all-stream.query"
import {
  GetLiveStreamResults,
  LiveStreamInfoResult,
} from "./get-all-stream.result"

@QueryHandler(GetAllStreamQuery)
export class GetAllStreamHandler {
  constructor(private readonly userRepository: IUserRepository) {}
  async execute(query: GetAllStreamQuery): Promise<GetLiveStreamResults> {
    const { limit, offset, order, orderBy } = query
    try {
      const liveStreamInfos =
        await this.userRepository.getAllLivingLiveStreamInfo({
          limit,
          offset,
          orderBy,
          order,
        })
      const result = await Promise.all(
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
      return { liveStreams: result.filter((e) => e !== null) || [] }
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
