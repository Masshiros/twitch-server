import { QueryHandler } from "@nestjs/cqrs"
import {
  QueryError,
  QueryErrorCode,
  QueryErrorDetailCode,
} from "libs/exception/application/query"
import { InfrastructureError } from "libs/exception/infrastructure"
import { ICategoriesRepository } from "src/module/categories/domain/repository/categories.interface.repository"
import { IFollowersRepository } from "src/module/followers/domain/repository/followers.interface.repository"
import { ImageService } from "src/module/image/application/image.service"
import { EImageType } from "src/module/image/domain/enum/image-type.enum"
import { LiveStreamInfo } from "src/module/users/domain/entity/live-stream-info.entity"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { LiveStreamInfoResult } from "../get-all-stream/get-all-stream.result"
import { GetTop5StreamQuery } from "./get-top-5-stream.query"
import { GetTop5StreamResult } from "./get-top-5-stream.result"

@QueryHandler(GetTop5StreamQuery)
export class GetTop5StreamHandler {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly categoryRepository: ICategoriesRepository,
    private readonly followerRepository: IFollowersRepository,
    private readonly imageService: ImageService,
  ) {}
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
          const [
            liveStreamCategories,
            liveStreamTags,
            liveStreams,
            followers,
            followings,
            ownerImages,
          ] = await Promise.all([
            this.userRepository.getLiveStreamInfoCategories(e.id),
            this.userRepository.getLiveStreamInfoTags(e.id),
            this.userRepository.getAllStreamSessions(user),
            this.followerRepository.findFollowersByUser(user.id),
            this.followerRepository.findFollowingByUser(user.id),
            this.imageService.getImageByApplicableId(user.id),
          ])
          const ownerAvatar = ownerImages.find(
            (e) => e.imageType === EImageType.AVATAR,
          )
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
            imageUrl: ownerAvatar?.url ?? "",
            totalView: totalViews,
            livestreamCategories: categories.filter((e) => e !== null),
            livestreamTags: tags.filter((e) => e !== null),
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
