import { QueryHandler } from "@nestjs/cqrs"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import {
  QueryError,
  QueryErrorCode,
  QueryErrorDetailCode,
} from "libs/exception/application/query"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { Follower } from "src/module/followers/domain/entity/followers.entity"
import { IFollowersRepository } from "src/module/followers/domain/repository/followers.interface.repository"
import { ImageService } from "src/module/image/application/image.service"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { FollowResult } from "../follow.result"
import { GetListFollowingsQuery } from "./get-list-followings.query"

@QueryHandler(GetListFollowingsQuery)
export class GetListFollowingsQueryHandler {
  constructor(
    private readonly followerRepostiory: IFollowersRepository,
    private readonly userRepository: IUserRepository,
    private readonly imageService: ImageService,
  ) {}
  async execute(query: GetListFollowingsQuery): Promise<FollowResult[] | null> {
    const { userId } = query

    try {
      if (!userId) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: "User id can not be empty",
          info: {
            errorCode: QueryErrorDetailCode.ID_CAN_NOT_BE_EMPTY,
          },
        })
      }
      const user = await this.userRepository.findById(userId)
      if (!user) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: "Follower not found",
          info: {
            errorCode: QueryErrorDetailCode.USER_NOT_FOUND,
          },
        })
      }
      const followings =
        await this.followerRepostiory.findFollowingByUser(userId)
      const result = await Promise.all(
        followings.map(async (follower) => {
          const user = await this.userRepository.findById(
            follower.destinationUserId,
          )
          const userImage = await this.imageService.getImageByApplicableId(
            user.id,
          )

          if (user) {
            if (userImage) {
              return {
                id: user.id,
                name: user.name,
                displayName: user.displayName,
                slug: user.slug,
                avatar: {
                  url: userImage[0].url,
                  publicId: userImage[0].publicId,
                },
                isLive: user.isLive,
                followDate: follower.followDate,
              }
            }
            return {
              id: user.id,
              name: user.name,
              displayName: user.displayName,
              slug: user.slug,
              avatar: {
                url: "",
                publicId: "",
              },
              isLive: user.isLive,
              followDate: follower.followDate,
            }
          }
          return null
        }),
      )
      return result
    } catch (err) {
      if (
        err instanceof DomainError ||
        err instanceof QueryError ||
        err instanceof InfrastructureError
      ) {
        throw err
      }

      throw new QueryError({
        code: QueryErrorCode.INTERNAL_SERVER_ERROR,
        message: err.message,
      })
    }
  }
}
