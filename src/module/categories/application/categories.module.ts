import { Module } from "@nestjs/common"
import { CqrsModule } from "@nestjs/cqrs"
import { CategoriesFactory } from "../domain/factory/categories.factory"
import { CategoriesDatabaseModule } from "../infrastructure/database/categories.database.module"
import { CategoriesController } from "../presentation/categories.controller"
import { CategoriesService } from "./categories.service"
import { GetAllCategoriesHandler } from "./query/get-all-categories/get-all-categories.handler"
import { GetCategoryByIdHandler } from "./query/get-category-by-id/get-category-by-id.handler"
import { GetCategoryBySlugHandler } from "./query/get-category-by-slug/get-category-by-slug.handler"

const commandHandlers = []
const queryHandlers = [
  GetAllCategoriesHandler,
  GetCategoryByIdHandler,
  GetCategoryBySlugHandler,
]
@Module({
  controllers: [CategoriesController],
  providers: [
    CategoriesFactory,
    CategoriesService,
    ...commandHandlers,
    ...queryHandlers,
  ],
  imports: [CqrsModule, CategoriesFactory, CategoriesDatabaseModule],
})
export class CategoriesModule {}
