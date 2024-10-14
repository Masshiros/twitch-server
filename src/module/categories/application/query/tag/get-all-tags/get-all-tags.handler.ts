import { QueryHandler } from "@nestjs/cqrs"
import { QueryError, QueryErrorCode } from "libs/exception/application/query"
import { InfrastructureError } from "libs/exception/infrastructure"
import { ICategoriesRepository } from "src/module/categories/domain/repository/categories.interface.repository"
import { TagResult } from "../tag.result"
import { GetAllTagsQuery } from "./get-all-tags.query"

@QueryHandler(GetAllTagsQuery)
export class GetAllTagsHandler {
  constructor(private readonly categoriesRepository: ICategoriesRepository) {}
  async execute(query: GetAllTagsQuery): Promise<TagResult[] | null> {
    const { limit, offset, order, orderBy } = query
    try {
      const tags = await this.categoriesRepository.getAllTags({
        limit,
        offset,
        orderBy,
        order,
      })
      if (!tags) {
        return null
      }
      const result = tags.map((tag) => {
        return { id: tag.id, name: tag.name, slug: tag.slug }
      })
      return result ?? null
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
