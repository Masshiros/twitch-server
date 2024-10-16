import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { SuccessMessages } from "libs/constants/success"
import { ApiOperationDecorator } from "libs/decorator/api-operation.decorator"
import { Public } from "libs/decorator/public.decorator"
import { ResponseMessage } from "libs/decorator/response-message.decorator"
import { CategoriesService } from "../application/categories.service"
import { CreateCategoryCommand } from "../application/command/category/create-category/create-category.command"
import { DeleteCategoryCommand } from "../application/command/category/delete-category/delete-category.command"
import { UpdateCategoryCommand } from "../application/command/category/update-category/update-category.command"
import { AssignTagsToCategoryCommand } from "../application/command/tag/assign-tags-to-category/assign-tags-to-category.command"
import { CreateTagCommand } from "../application/command/tag/create-tag/create-tag.command"
import { DeleteTagCommand } from "../application/command/tag/delete-tag/delete-tag.command"
import { UpdateTagCommand } from "../application/command/tag/update-tag/update-tag.command"
import { GetAllCategoriesQuery } from "../application/query/category/get-all-categories/get-all-categories.query"
import { GetCategoriesByTagQuery } from "../application/query/category/get-categories-by-tag/get-categories-by-tag.query"
import { GetCategoryByIdQuery } from "../application/query/category/get-category-by-id/get-category-by-id.query"
import { GetCategoryBySlugQuery } from "../application/query/category/get-category-by-slug/get-category-by-slug.query"
import { GetAllTagsQuery } from "../application/query/tag/get-all-tags/get-all-tags.query"
import { AssignTagsToCategoryRequestDto } from "./http/dto/request/assign-tags-to-category.request.dto"
import { CreateCategoryRequestDto } from "./http/dto/request/create-category.request.dto"
import { CreateTagRequestDto } from "./http/dto/request/create-tag.request.dto"
import { DeleteCategoryRequestDto } from "./http/dto/request/delete-category.request.dto"
import { DeleteTagRequestDto } from "./http/dto/request/delete-tag.request.dto"
import { GetAllCategoriesRequestDto } from "./http/dto/request/get-all-categories.request.dto"
import { GetAllTagsRequestDto } from "./http/dto/request/get-all-tags.request.dto"
import { GetCategoriesByTagRequestDto } from "./http/dto/request/get-categories-by-tag.request.dto"
import { GetCategoryByIdRequestDto } from "./http/dto/request/get-category-by-id.request.dto"
import { GetCategoryBySlugRequestDto } from "./http/dto/request/get-category-by-slug.request.dto"
import { UpdateCategoryRequestDto } from "./http/dto/request/update-category.request.dto"
import { UpdateTagRequestDto } from "./http/dto/request/update-tag.request.dto"
import { CategoryResponseDto } from "./http/dto/response/category.response.dto"
import { TagResponseDto } from "./http/dto/response/tag.response.dto"

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
  @ApiOperationDecorator({
    summary: "Get category",
    description: "Get category by id",
    type: CategoryResponseDto,
  })
  @ResponseMessage(SuccessMessages.categories.GET_CATEGORY_BY_ID)
  @Public()
  @Get("/:id")
  async getCategoryById(
    @Param() param: GetCategoryByIdRequestDto,
  ): Promise<CategoryResponseDto | null> {
    const query = new GetCategoryByIdQuery(param)
    const result = await this.service.getCategoryById(query)
    return result ?? null
  }
  @ApiOperationDecorator({
    summary: "Get category",
    description: "Get category by slug",
    type: CategoryResponseDto,
  })
  @ResponseMessage(SuccessMessages.categories.GET_CATEGORY_BY_SLUG)
  @Public()
  @Get("/slug/:slug")
  async getCategoryBySlug(
    @Param() param: GetCategoryBySlugRequestDto,
  ): Promise<CategoryResponseDto | null> {
    const query = new GetCategoryBySlugQuery(param)
    const result = await this.service.getCategoryBySlug(query)
    return result ?? null
  }
  @ApiOperationDecorator({
    summary: "Get categories",
    description: "Get categories by tag",
    type: CategoryResponseDto,
  })
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
  @ApiOperationDecorator({
    summary: "Create category",
    description: "Create category",
    auth: true,
  })
  @ResponseMessage(SuccessMessages.categories.CREATE_CATEGORY)
  @Post("")
  async createCategory(@Body() body: CreateCategoryRequestDto) {
    const command = new CreateCategoryCommand(body)
    await this.service.createCategory(command)
  }
  @ApiOperationDecorator({
    summary: "Delete category",
    description: "Delete category",
    auth: true,
  })
  @ResponseMessage(SuccessMessages.categories.DELETE_CATEGORY)
  @Delete("/:id")
  async deleteCategory(@Param() param: DeleteCategoryRequestDto) {
    const command = new DeleteCategoryCommand({ categoryId: param.id })
    await this.service.deleteCategory(command)
  }
  @ApiOperationDecorator({
    summary: "Update category",
    description: "Update category",
    auth: true,
  })
  @ResponseMessage(SuccessMessages.categories.UPDATE_CATEGORY)
  @Patch("/:id")
  async updateCategory(
    @Param("id") id: string,
    @Body() body: UpdateCategoryRequestDto,
  ) {
    const command = new UpdateCategoryCommand({ categoryId: id, ...body })
    await this.service.updateCategory(command)
  }
  @ApiOperationDecorator({
    summary: "Get all tags",
    description: "Get all tags",
    type: TagResponseDto,
  })
  @ResponseMessage(SuccessMessages.tags.GET_ALL_TAGS)
  @Public()
  @Get("/all/tags")
  async getAllTags(
    @Query() data: GetAllTagsRequestDto,
  ): Promise<TagResponseDto[] | null> {
    const query = new GetAllTagsQuery(data)
    return (await this.service.getAllTags(query)) ?? null
  }

  @ApiOperationDecorator({
    summary: "Create tag",
    description: "Create tag",
    auth: true,
  })
  @ResponseMessage(SuccessMessages.tags.CREATE_TAG)
  @Post("/tags")
  async createTag(@Body() body: CreateTagRequestDto) {
    const command = new CreateTagCommand(body)
    await this.service.createTag(command)
  }
  @ApiOperationDecorator({
    summary: "Delete tag",
    description: "Delete tag",
    auth: true,
  })
  @ResponseMessage(SuccessMessages.tags.DELETE_TAG)
  @Delete("/tags/:id")
  async deleteTag(@Param() param: DeleteTagRequestDto) {
    const command = new DeleteTagCommand({ tagId: param.id })
    await this.service.deleteTag(command)
  }
  @ApiOperationDecorator({
    summary: "Update tag",
    description: "Update tag",
    auth: true,
  })
  @ResponseMessage(SuccessMessages.tags.DELETE_TAG)
  @Patch("/tags/:id")
  async updateTag(@Param("id") id: string, @Body() body: UpdateTagRequestDto) {
    const command = new UpdateTagCommand({ tagId: id, ...body })
    await this.service.updateTag(command)
  }
  @ApiOperationDecorator({
    summary: "Assign tags to category",
    description: "Assign tags to category",
    auth: true,
  })
  @ResponseMessage(SuccessMessages.tags.ASSIGN_TAGS_TO_CATEGORY)
  @Post("/tags/assign-to-category")
  async assignTagsToCategory(@Body() body: AssignTagsToCategoryRequestDto) {
    const command = new AssignTagsToCategoryCommand({
      categoryId: body.categoryId,
      tagsId: body.tagIds,
    })
    await this.service.assignTagsToCategory(command)
  }
}
