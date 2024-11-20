import { Injectable } from "@nestjs/common"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { CreateCategoryCommand } from "./command/category/create-category/create-category.command"
import { DeleteCategoryCommand } from "./command/category/delete-category/delete-category.command"
import { UpdateCategoryCommand } from "./command/category/update-category/update-category.command"
import { AssignTagsToCategoryCommand } from "./command/tag/assign-tags-to-category/assign-tags-to-category.command"
import { CreateTagCommand } from "./command/tag/create-tag/create-tag.command"
import { DeleteTagCommand } from "./command/tag/delete-tag/delete-tag.command"
import { UpdateTagCommand } from "./command/tag/update-tag/update-tag.command"
import { GetAllCategoriesQuery } from "./query/category/get-all-categories/get-all-categories.query"
import { GetCategoriesByTagQuery } from "./query/category/get-categories-by-tag/get-categories-by-tag.query"
import { GetCategoryByIdQuery } from "./query/category/get-category-by-id/get-category-by-id.query"
import { GetCategoryBySlugQuery } from "./query/category/get-category-by-slug/get-category-by-slug.query"
import { SearchCategoryByNameQuery } from "./query/category/search-category-by-name/search-category-by-name.query"
import { GetAllTagsQuery } from "./query/tag/get-all-tags/get-all-tags.query"

@Injectable()
export class CategoriesService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  async getCategoriesWithPagination(query: GetAllCategoriesQuery) {
    return this.queryBus.execute(query)
  }
  async getCategoryById(query: GetCategoryByIdQuery) {
    return this.queryBus.execute(query)
  }
  async getCategoryBySlug(query: GetCategoryBySlugQuery) {
    return this.queryBus.execute(query)
  }
  async getCategoriesByTag(query: GetCategoriesByTagQuery) {
    return this.queryBus.execute(query)
  }
  async searchCategoryByName(query: SearchCategoryByNameQuery) {
    return this.queryBus.execute(query)
  }
  async getAllTags(query: GetAllTagsQuery) {
    return this.queryBus.execute(query)
  }
  async createCategory(command: CreateCategoryCommand) {
    this.commandBus.execute(command)
  }
  async deleteCategory(command: DeleteCategoryCommand) {
    this.commandBus.execute(command)
  }
  async updateCategory(command: UpdateCategoryCommand) {
    this.commandBus.execute(command)
  }
  async createTag(command: CreateTagCommand) {
    this.commandBus.execute(command)
  }
  async deleteTag(command: DeleteTagCommand) {
    this.commandBus.execute(command)
  }
  async updateTag(command: UpdateTagCommand) {
    this.commandBus.execute(command)
  }
  async assignTagsToCategory(command: AssignTagsToCategoryCommand) {
    this.commandBus.execute(command)
  }
}
