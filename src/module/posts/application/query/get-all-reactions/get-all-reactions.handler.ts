import { QueryHandler } from "@nestjs/cqrs"
import {
  CommandError,
  CommandErrorCode,
} from "libs/exception/application/command"
import {
  QueryError,
  QueryErrorCode,
  QueryErrorDetailCode,
} from "libs/exception/application/query"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { ImageService } from "src/module/image/application/image.service"
import { IPostsRepository } from "src/module/posts/domain/repository/posts.interface.repository"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { GetAllReactionsQuery } from "./get-all-reactions.query"
import { GetAllReactionsResult } from "./get-all-reactions.result"

@QueryHandler(GetAllReactionsQuery)
export class GetAllReactionsHandler {
  constructor(
    private readonly postRepository: IPostsRepository,
    private readonly userRepository: IUserRepository,
    private readonly imageService: ImageService,
  ) {}
  async execute(query: GetAllReactionsQuery): Promise<GetAllReactionsResult> {
    const { postId } = query
    try {
      if (!postId || postId.length === 0) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: "Data from client can not be empty",
          info: {
            errorCode: QueryErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
            field: "postId",
          },
        })
      }
      const post = await this.postRepository.findPostById(postId)
      if (!post) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: "Post not found",
          info: {
            errorCode: QueryErrorDetailCode.NOT_FOUND,
          },
        })
      }
      const reactions = await this.postRepository.getPostReactions(post)
      if (!reactions) {
        return { reactionCount: 0, users: [] }
      }
      const users = await Promise.all(
        reactions.map(async (r) => {
          const user = await this.userRepository.findById(r.userId)
          if (!user) {
            return null
          }
          const avatar = await this.imageService.getImageByApplicableId(user.id)

          return {
            id: user.id,
            username: user.name,
            avatar: avatar[0]?.url ?? "",
            reactionType: r.type,
          }
        }),
      )
      return {
        reactionCount: users?.length ?? 0,
        users: users ?? [],
      }
    } catch (err) {
      if (
        err instanceof DomainError ||
        err instanceof QueryError ||
        err instanceof InfrastructureError
      ) {
        throw err
      }

      throw new CommandError({
        code: CommandErrorCode.INTERNAL_SERVER_ERROR,
        message: err.message,
      })
    }
  }
}
