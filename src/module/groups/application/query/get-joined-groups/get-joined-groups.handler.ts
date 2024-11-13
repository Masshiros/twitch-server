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
import { GetJoinedGroupQuery } from "./get-joined-groups.query"
import { GetJoinedGroupResult } from "./get-joined-groups.result"

@QueryHandler(GetJoinedGroupQuery)
export class GetJoinedGroupHandler {
  constructor(
    private readonly groupRepository: IGroupRepository,
    private readonly userRepository: IUserRepository,
    private readonly imageService: ImageService,
  ) {}
  async execute(query: GetJoinedGroupQuery): Promise<GetJoinedGroupResult> {
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

      const result = await Promise.all(
        groups.map(async (g) => {
          const [groupCoverImage, member] = await Promise.all([
            this.imageService.getImageByApplicableId(g.id),
            this.groupRepository.findMemberById(g.id, user.id),
          ])

          return {
            info: {
              id: g.id,
              name: g.name,
              coverImage: groupCoverImage[0]?.url ?? "",
            },
            joinedAt: member.joinedAt,
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
