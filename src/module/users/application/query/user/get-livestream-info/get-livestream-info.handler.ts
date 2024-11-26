import { QueryHandler } from "@nestjs/cqrs"
import {
  QueryError,
  QueryErrorCode,
  QueryErrorDetailCode,
} from "libs/exception/application/query"
import { InfrastructureError } from "libs/exception/infrastructure"
import { ICategoriesRepository } from "src/module/categories/domain/repository/categories.interface.repository"
import { IFollowersRepository } from "src/module/followers/domain/repository/followers.interface.repository"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { LiveStreamInfoResult } from "../get-all-stream/get-all-stream.result"
import { GetLivestreamInfoQuery } from "./get-livestream-info.query"

@QueryHandler(GetLivestreamInfoQuery)
export class GetLivestreamInfoHandler {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly categoryRepository: ICategoriesRepository,
    private readonly followerRepository: IFollowersRepository,
  ) {}
  async execute(query: GetLivestreamInfoQuery): Promise<LiveStreamInfoResult> {
    const { username } = query
    try {
      if (!username || username.length === 0) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: "username can not be empty",
        })
      }
      const user = await this.userRepository.findByUsername(username)
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
      const [
        liveStreamCategories,
        liveStreamTags,
        liveStreams,
        followers,
        followings,
      ] = await Promise.all([
        this.userRepository.getLiveStreamInfoCategories(livestreamInfo.id),
        this.userRepository.getLiveStreamInfoTags(livestreamInfo.id),
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
      return {
        id: livestreamInfo.id,
        userId: user.id,
        userName: user.name,
        userSlug: user.slug,
        followersCount: followers.length,
        followingsCount: followings.length,
        bio: user.bio,
        displayName: user.displayName,
        title: livestreamInfo.title,
        isLive: livestreamInfo.isLive,
        totalView: totalViews,
        livestreamCategories: categories.filter((e) => e !== null),
        livestreamTags: tags.filter((e) => e !== null),
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
