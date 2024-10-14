import { Controller, Get, Param, Query } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { SuccessMessages } from "libs/constants/success"
import { ApiOperationDecorator } from "libs/decorator/api-operation.decorator"
import { Public } from "libs/decorator/public.decorator"
import { ResponseMessage } from "libs/decorator/response-message.decorator"
import { CategoriesService } from "../application/categories.service"
import { GetAllCategoriesQuery } from "../application/query/get-all-categories/get-all-categories.query"
import { GetCategoriesByTagQuery } from "../application/query/get-categories-by-tag/get-categories-by-tag.query"
import { GetCategoryByIdQuery } from "../application/query/get-category-by-id/get-category-by-id.query"
import { GetCategoryBySlugQuery } from "../application/query/get-category-by-slug/get-category-by-slug.query"
import { GetAllCategoriesRequestDto } from "./http/dto/request/get-all-categories.request.dto"
import { GetCategoriesByTagRequestDto } from "./http/dto/request/get-categories-by-tag.request.dto"
import { GetCategoryByIdRequestDto } from "./http/dto/request/get-category-by-id.request.dto"
import { GetCategoryBySlugRequestDto } from "./http/dto/request/get-category-by-slug.request.dto"
import { CategoryResponseDto } from "./http/dto/response/category.response.dto"

@ApiTags("categories")
@Controller("categories")
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @ApiOperationDecorator({
    summary: "Get all categories",
    description: "Get all categories with pagination",
    type: CategoryResponseDto,
  })
  @ResponseMessage(SuccessMessages.categories.GET_ALL_CATEGORIES)
  @Public()
  @Get()
  async getCategoriesWithPagination(
    @Query() data: GetAllCategoriesRequestDto,
  ): Promise<CategoryResponseDto[] | null> {
    const query = new GetAllCategoriesQuery(data)
    query.offset = (data.page - 1) * data.limit
    const result = await this.service.getCategoriesWithPagination(query)
    return result ?? null
  }
  @ResponseMessage(SuccessMessages.categories.GET_CATEGORY_BY_ID)
  @Public()
  @Get("/category/:id")
  async getCategoryById(
    @Param() param: GetCategoryByIdRequestDto,
  ): Promise<CategoryResponseDto | null> {
    const query = new GetCategoryByIdQuery(param)
    const result = await this.service.getCategoryById(query)
    return result ?? null
  }
  @ResponseMessage(SuccessMessages.categories.GET_CATEGORY_BY_SLUG)
  @Public()
  @Get("/category/:slug")
  async getCategoryBySlug(
    @Param() param: GetCategoryBySlugRequestDto,
  ): Promise<CategoryResponseDto | null> {
    const query = new GetCategoryBySlugQuery(param)
    const result = await this.service.getCategoryBySlug(query)
    return result ?? null
  }
  @ResponseMessage(SuccessMessages.categories.GET_CATEGORIES_BY_TAG)
  @Public()
  @Get("/tags/:tagId")
  async getCategoriesByTag(
    @Param() param: GetCategoriesByTagRequestDto,
  ): Promise<CategoryResponseDto[] | null> {
    const query = new GetCategoriesByTagQuery(param)
    const result = await this.service.getCategoriesByTag(query)
    return result ?? null
  }
}
