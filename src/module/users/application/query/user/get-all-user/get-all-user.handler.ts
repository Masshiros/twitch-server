import { QueryHandler } from "@nestjs/cqrs"
import { QueryError, QueryErrorCode } from "libs/exception/application/query"
import { InfrastructureError } from "libs/exception/infrastructure"
import { ImageService } from "src/module/image/application/image.service"
import { EImageType } from "src/module/image/domain/enum/image-type.enum"
import { UserFactory } from "src/module/users/domain/factory/user"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { GetAllUsersQuery } from "./get-all-user.query"
import { GetAllUsersQueryResult } from "./get-all-user.result"

@QueryHandler(GetAllUsersQuery)
export class GetAllUsersQueryHandler {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userFactory: UserFactory,
    private readonly imageService: ImageService,
  ) {}
  async execute(
    query: GetAllUsersQuery,
  ): Promise<GetAllUsersQueryResult | null> {
    const { limit, offset, filters } = query

    try {
      const user = await this.userRepository.getAllWithPagination({
        limit,
        offset,
        filters,
      })

      const result = await Promise.all(
        user.map(async (u) => {
          const [userImage, roles] = await Promise.all([
            this.imageService.getImageByApplicableId(u.id),
            this.userRepository.getUserRoles(u),
          ])
          const userAvatar = userImage.find(
            (e) => e.imageType === EImageType.AVATAR,
          )
          const roleNames = roles.map((e) => e.name)

          return {
            user: u,
            roles: roleNames,
            image: {
              url: userAvatar?.url ?? "",
              publicId: userAvatar?.publicId ?? "",
            },
          }
        }),
      )
      return { result }
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
