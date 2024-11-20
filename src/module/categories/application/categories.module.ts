import { Module } from "@nestjs/common"
import { CqrsModule } from "@nestjs/cqrs"
import { ImageModule } from "src/module/image/application/image.module"
import { CategoriesFactory } from "../domain/factory/categories.factory"
import { CategoriesDatabaseModule } from "../infrastructure/database/categories.database.module"
import { CategoriesController } from "../presentation/categories.controller"
import { CategoriesService } from "./categories.service"
import { CreateCategoryHandler } from "./command/category/create-category/create-category.handler"
import { DeleteCategoryHandler } from "./command/category/delete-category/delete-category.handler"
import { UpdateCategoryHandler } from "./command/category/update-category/update-category.handler"
import { AssignTagsToCategoryHandler } from "./command/tag/assign-tags-to-category/assign-tags-to-category.handler"
import { CreateTagHandler } from "./command/tag/create-tag/create-tag.handler"
import { DeleteTagHandler } from "./command/tag/delete-tag/delete-tag.handler"
import { UpdateTagHandler } from "./command/tag/update-tag/update-tag.handler"
import { GetAllCategoriesHandler } from "./query/category/get-all-categories/get-all-categories.handler"
import { GetCategoriesByTagHandler } from "./query/category/get-categories-by-tag/get-categories-by-tag.handler"
import { GetCategoryByIdHandler } from "./query/category/get-category-by-id/get-category-by-id.handler"
import { GetCategoryBySlugHandler } from "./query/category/get-category-by-slug/get-category-by-slug.handler"
import { SearchCategoryByNameHandler } from "./query/category/search-category-by-name/search-category-by-name.handler"
import { GetAllTagsHandler } from "./query/tag/get-all-tags/get-all-tags.handler"

const commandHandlers = [
  CreateCategoryHandler,
  DeleteCategoryHandler,
  UpdateCategoryHandler,
  CreateTagHandler,
  UpdateTagHandler,
  DeleteTagHandler,
  AssignTagsToCategoryHandler,
]
const queryHandlers = [
  GetAllCategoriesHandler,
  GetCategoryByIdHandler,
  GetCategoryBySlugHandler,
  GetCategoriesByTagHandler,
  GetAllTagsHandler,
  SearchCategoryByNameHandler,
]
@Module({
  controllers: [CategoriesController],
  providers: [
    CategoriesFactory,
    CategoriesService,
    ...commandHandlers,
    ...queryHandlers,
  ],
  imports: [
    CqrsModule,
    CategoriesFactory,
    CategoriesDatabaseModule,
    ImageModule,
  ],
})
export class CategoriesModule {}
