import { QueryHandler } from "@nestjs/cqrs"
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
import { SearchPostQuery } from "./search-post.query"
import { SearchPostResult } from "./search-post.result"

@QueryHandler(SearchPostQuery)
export class SearchPostHandler {
  constructor(
    private readonly postRepository: IPostsRepository,
    private readonly userRepository: IUserRepository,
    private readonly imageService: ImageService,
  ) {}
  async execute(query: SearchPostQuery): Promise<SearchPostResult> {
    const { keyword } = query
    try {
      if (!keyword || keyword.length === 0) {
        throw new QueryError({
          code: QueryErrorCode.BAD_REQUEST,
          message: "Keyword can not be empty",
          info: {
            errorCode: QueryErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
            field: "keyword",
          },
        })
      }
      const posts = await this.postRepository.searchPostsByKeyword(keyword)
      const result = await Promise.all(
        posts.map(async (p) => {
          const [images, owner] = await Promise.all([
            this.imageService.getImageByApplicableId(p.id),
            this.userRepository.findById(p.userId),
          ])
          const ownerAvatar = await this.imageService.getImageByApplicableId(
            owner.id,
          )
          return {
            user: {
              id: owner.id,
              username: owner.name,
              avatar: ownerAvatar[0]?.url ?? "",
            },
            info: {
              createdAt: p.createdAt.toISOString().split("T")[0],
              visibility: p.visibility,
              content: p.content,
              images: images.map((i) => ({ url: i.url })),
            },
          }
        }),
      )
      return { posts: result.filter((p) => p !== null) }
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
