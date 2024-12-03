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
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { GetUserByUserNameQuery } from "./get-user-by-username.query"
import { GetUserByUsernameResult } from "./get-user-by-username.result"

@QueryHandler(GetUserByUserNameQuery)
export class GetUserByUserNameHandler {
  constructor(
    private readonly userRepository: IUserRepository,

    private readonly imageService: ImageService,

    private readonly followersRepository: IFollowersRepository,
  ) {}
  async execute(
    query: GetUserByUserNameQuery,
  ): Promise<GetUserByUsernameResult | null> {
    const { username } = query
    try {
      if (username.length === 0) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: "User id can not be empty",
          info: {
            errorCode: QueryErrorDetailCode.USER_ID_CAN_NOT_BE_EMPTY,
          },
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
      const images: any[] | null =
        await this.imageService.getImageByApplicableId(user.id)
      const avatar = images.find((e) => e.imageType === EImageType.AVATAR)
      const [followers, followings] = await Promise.all([
        this.followersRepository.findFollowersByUser(user.id),
        this.followersRepository.findFollowingByUser(user.id),
      ])
      return {
        user,
        numberOfFollowers: followers.length,
        numberOfFollowings: followings.length,
        image: { url: avatar?.url ?? "", publicId: avatar?.public ?? "" },
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
