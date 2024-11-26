import { QueryHandler } from "@nestjs/cqrs"
import {
  QueryError,
  QueryErrorCode,
  QueryErrorDetailCode,
} from "libs/exception/application/query"
import { InfrastructureError } from "libs/exception/infrastructure"
import { ICategoriesRepository } from "src/module/categories/domain/repository/categories.interface.repository"
import { IFollowersRepository } from "src/module/followers/domain/repository/followers.interface.repository"
import { LiveStreamInfo } from "src/module/users/domain/entity/live-stream-info.entity"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { GetAllStreamQuery } from "./get-all-stream.query"
import {
  GetLiveStreamResults,
  LiveStreamInfoResult,
} from "./get-all-stream.result"

@QueryHandler(GetAllStreamQuery)
export class GetAllStreamHandler {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly categoryRepository: ICategoriesRepository,
    private readonly followerRepository: IFollowersRepository,
  ) {}
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
          const [
            liveStreamCategories,
            liveStreamTags,
            liveStreams,
            followers,
            followings,
          ] = await Promise.all([
            this.userRepository.getLiveStreamInfoCategories(e.id),
            this.userRepository.getLiveStreamInfoTags(e.id),
            this.userRepository.getAllStreamSessions(user),
            this.followerRepository.findFollowersByUser(user.id),
            this.followerRepository.findFollowingByUser(user.id),
          ])
          const categories = await Promise.all(
            liveStreamCategories.map((e) => {
              return this.categoryRepository.getCategoryById(e.categoryId)
            }),
          )
          const tags = await Promise.all(
            liveStreamTags.map((e) => {
              return this.categoryRepository.getTagById(e.tagId)
            }),
          )
          const totalViews = liveStreams.reduce(
            (acc, stream) => acc + stream.totalView,
            4,
          )
          const liveStreamInfo: LiveStreamInfoResult = {
            id: e.id,
            userId: user?.id ?? "",
            userName: user?.name ?? "",
            userSlug: user?.slug ?? "",
            followersCount: followers.length,
            followingsCount: followings.length,
            bio: user.bio,
            displayName: user.displayName,
            title: e.title ?? "",
            isLive: e.isLive ?? true,
            totalView: totalViews,
            livestreamCategories: categories.filter((e) => e !== null),
            livestreamTags: tags.filter((e) => e !== null),
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
