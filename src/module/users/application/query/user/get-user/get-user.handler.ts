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
import { UserAggregate } from "src/module/users/domain/aggregate"
import { UserFactory } from "src/module/users/domain/factory/user"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { GetUserQuery } from "./get-user.query"
import { GetUserQueryResult } from "./get-user.result"

@QueryHandler(GetUserQuery)
export class GetUserQueryHandler {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userFactory: UserFactory,
    private readonly imageService: ImageService,
    private readonly categoryRepository: ICategoriesRepository,
    private readonly followersRepository: IFollowersRepository,
  ) {}
  async execute(
    query: GetUserQuery,
    //currentUser: { id: string; username: string },
  ): Promise<GetUserQueryResult | null> {
    const { id: targetUserId } = query
    try {
      // const currentUserAggregte: UserAggregate | null =
      //   await this.userRepository.findByUsername(currentUser.username)

      // if (!currentUserAggregte || currentUserAggregte.id !== currentUser.id) {
      //   throw new QueryError({
      //     code: QueryErrorCode.BAD_REQUEST,
      //     message: "Unauthorized",
      //     info: {
      //       errorCode: QueryErrorDetailCode.UNAUTHORIZED,
      //     },
      //   })
      // }

      if (targetUserId.length === 0) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: "User id can not be empty",
          info: {
            errorCode: QueryErrorDetailCode.USER_ID_CAN_NOT_BE_EMPTY,
          },
        })
      }

      const targetUserAggregate: UserAggregate | null =
        await this.userRepository.findById(targetUserId)

      if (!targetUserAggregate) {
        throw new QueryError({
          code: QueryErrorCode.NOT_FOUND,
          message: "User not found",
          info: {
            errorCode: QueryErrorDetailCode.USER_NOT_FOUND,
          },
        })
      }
      // get user image
      const images: any[] | null =
        await this.imageService.getImageByApplicableId(targetUserAggregate.id)
      const avatar = images.find((e) => e.imageType === EImageType.AVATAR)
      // get user categories
      let categoryNames = []

      const liveStreamInfo =
        await this.userRepository.getStreamInfoByUser(targetUserAggregate)
      if (liveStreamInfo) {
        const liveStreamInfoCategories =
          await this.userRepository.getLiveStreamInfoCategories(
            liveStreamInfo.id,
          )

        const categories = await Promise.all(
          liveStreamInfoCategories.map(async (e) => {
            return await this.categoryRepository.getCategoryById(e.categoryId)
          }),
        )

        categoryNames = categories.map((e) => {
          return e.name
        })
      }

      // get number of followers and followings
      const [followers, followings, roles] = await Promise.all([
        this.followersRepository.findFollowersByUser(targetUserAggregate.id),
        this.followersRepository.findFollowingByUser(targetUserAggregate.id),
        this.userRepository.getUserRoles(targetUserAggregate),
      ])
      const roleNames = roles.map((e) => e.name)

      return {
        user: targetUserAggregate,
        roleNames,
        categoryNames: categoryNames ?? [],
        numberOfFollowers: followers.length,
        numberOfFollowings: followings.length,
        image: { url: avatar?.url ?? "", publicId: avatar?.public ?? "" },
      }
    } catch (err) {
      console.error(err.stack)
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
