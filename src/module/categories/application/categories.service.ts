import { Injectable } from "@nestjs/common"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { GetAllCategoriesQuery } from "./query/get-all-categories/get-all-categories.query"
import { GetCategoryByIdQuery } from "./query/get-category-by-id/get-category-by-id.query"
import { GetCategoryBySlugQuery } from "./query/get-category-by-slug/get-category-by-slug.query"

@Injectable()
export class CategoriesService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  async getCategoriesWithPagination(query: GetAllCategoriesQuery) {
    return await this.queryBus.execute(query)
  }
  async getCategoryById(query: GetCategoryByIdQuery) {
    return await this.queryBus.execute(query)
  }
  async getCategoryBySlug(query: GetCategoryBySlugQuery) {
    return await this.queryBus.execute(query)
  }
}
