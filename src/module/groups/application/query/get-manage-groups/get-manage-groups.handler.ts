import { QueryHandler } from "@nestjs/cqrs"
import {
  QueryError,
  QueryErrorCode,
  QueryErrorDetailCode,
} from "libs/exception/application/query"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { IGroupRepository } from "src/module/groups/domain/repository/group.interface.repository"
import { ImageService } from "src/module/image/application/image.service"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { GetManageGroupQuery } from "./get-manage-groups.query"
import { GetManageGroupResult } from "./get-manage-groups.result"

@QueryHandler(GetManageGroupQuery)
export class GetManageGroupHandler {
  constructor(
    private readonly groupRepository: IGroupRepository,
    private readonly userRepository: IUserRepository,
    private readonly imageService: ImageService,
  ) {}
  async execute(query: GetManageGroupQuery): Promise<GetManageGroupResult> {
    const { userId, limit, offset, order, orderBy } = query
    try {
      if (!userId || userId.length === 0) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: "User id can not be empty",
          info: {
            errorCode: QueryErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
          },
        })
      }
      const user = await this.userRepository.findById(userId)
      if (!user) {
        throw new QueryError({
          code: QueryErrorCode.NOT_FOUND,
          message: "User not found",
          info: {
            errorCode: QueryErrorDetailCode.NOT_FOUND,
          },
        })
      }
      const groups = await this.groupRepository.getAllUserGroups(user.id, {
        limit,
        offset,
        orderBy,
        order,
      })
      const manageGroups = groups.filter((g) => g.ownerId === userId)

      const result = await Promise.all(
        manageGroups.map(async (g) => {
          const groupCoverImage =
            await this.imageService.getImageByApplicableId(g.id)

          return {
            info: {
              id: g.id,
              name: g.name,
              coverImage: groupCoverImage[0]?.url ?? "",
            },
            createdAt: g.createdAt.toISOString().split("T")[0],
          }
        }),
      )
      return { groups: result }
    } catch (error) {
      if (
        error instanceof DomainError ||
        error instanceof QueryError ||
        error instanceof InfrastructureError
      ) {
        throw error
      }

      throw new QueryError({
        code: QueryErrorCode.INTERNAL_SERVER_ERROR,
        message: "Internal Server Error",
      })
    }
  }
}
