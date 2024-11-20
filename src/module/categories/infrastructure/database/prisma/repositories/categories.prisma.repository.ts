import { Injectable } from "@nestjs/common"
import { Prisma } from "@prisma/client"
import {
  InfrastructureError,
  InfrastructureErrorCode,
} from "libs/exception/infrastructure"
import { PrismaService } from "prisma/prisma.service"
import { Category } from "src/module/categories/domain/entity/categories.entity"
import { Tag } from "src/module/categories/domain/entity/tags.entity"
import { ICategoriesRepository } from "src/module/categories/domain/repository/categories.interface.repository"
import { handlePrismaError } from "utils/prisma-error"
import { CategoryMapper } from "../mapper/categories.mapper"
import { TagMapper } from "../mapper/tags.mapper"

@Injectable()
export class CategoriesRepository implements ICategoriesRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async getAllTags({
    limit = 1,
    offset = 0,
    orderBy = "createdAt",
    order = "desc",
  }: {
    limit: number
    offset: number
    orderBy: string
    order: "asc" | "desc"
  }): Promise<Tag[] | null> {
    try {
      const tags = await this.prismaService.tag.findMany({
        where: { deletedAt: null },
        ...(offset !== null ? { skip: offset } : {}),
        ...(limit !== null ? { take: limit } : {}),
        select: {
          id: true,
        },
      })
      if (!tags) {
        return null
      }
      const ids = tags.map((tag) => tag.id)
      const queryTag = await this.prismaService.tag.findMany({
        where: { id: { in: ids } },
        orderBy: { [orderBy]: order },
      })
      if (!queryTag) {
        return null
      }
      const result = queryTag.map((e) => {
        const tag = TagMapper.toDomain(e)
        return tag
      })
      return result ?? null
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async addTag(tag: Tag): Promise<void> {
    try {
      const data = TagMapper.toPersistence(tag)
      const existTag = await this.prismaService.tag.findUnique({
        where: { slug: data.slug },
      })
      if (existTag) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
          message: "Already exist this data",
        })
      }
      await this.prismaService.tag.create({ data: data })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async removeTag(tag: Tag): Promise<void> {
    try {
      const tagCategories = await this.prismaService.tagsCategories.findMany({
        where: { tagId: tag.id },
      })
      if (tagCategories) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.BAD_REQUEST,
          message: "Still have data refer to this record",
        })
      }
      await this.prismaService.tag.delete({ where: { id: tag.id } })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async updateTag(data: Tag): Promise<void> {
    try {
      const { id } = data
      let foundTag = await this.prismaService.tag.findFirst({
        where: { id: id },
      })
      if (!foundTag) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.NOT_FOUND,
          message: "Tag not found",
        })
      }
      foundTag = TagMapper.toPersistence(data)
      const updatedTag = await this.prismaService.tag.update({
        where: { id },
        data: foundTag,
      })
      if (!updatedTag) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.BAD_REQUEST,
          message: "Update operation not work",
        })
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async getTagBySlug(slug: string): Promise<Tag | null> {
    try {
      const tag = await this.prismaService.tag.findFirst({
        where: { slug },
      })
      if (!tag) {
        return null
      }
      const result = TagMapper.toDomain(tag)
      return result ?? null
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async getTagById(id: string): Promise<Tag | null> {
    try {
      const tag = await this.prismaService.tag.findFirst({ where: { id } })
      if (!tag) {
        return null
      }
      const result = TagMapper.toDomain(tag)
      return result ?? null
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async getTagsByCategory(category: Category): Promise<Tag[] | null> {
    try {
      const tagCategories = await this.prismaService.tagsCategories.findMany({
        where: { categoryId: category.id },
      })
      if (!tagCategories || tagCategories.length === 0) {
        return null
      }
      const tags = await Promise.all(
        tagCategories.map(async (e) => {
          const tag = await this.prismaService.tag.findUnique({
            where: { id: e.tagId },
          })
          if (!tag) {
            return null
          }
          return tag
        }),
      )
      if (!tags || tags.length === 0) {
        return null
      }
      const result = tags.map((tag) => TagMapper.toDomain(tag))
      return result ?? null
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async assignTagsToCategory(tags: Tag[], category: Category): Promise<void> {
    try {
      const existingCategory = await this.prismaService.category.findUnique({
        where: { id: category.id },
      })
      if (!existingCategory) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.BAD_REQUEST,
          message: "Category not found",
        })
      }
      for (const tag of tags) {
        const existingTag = await this.prismaService.tag.findUnique({
          where: { id: tag.id },
        })

        if (!existingTag) {
          throw new InfrastructureError({
            code: InfrastructureErrorCode.BAD_REQUEST,
            message: `Tag not found: ${tag.name}`,
          })
        }
      }
      await this.prismaService.tagsCategories.createMany({
        data: tags.map((tag) => ({
          categoryId: category.id,
          tagId: tag.id,
        })),
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async getAllCategories({
    limit,
    offset = 0,
    orderBy = "createdAt",
    order = "desc",
  }: {
    limit: number
    offset: number
    orderBy: string
    order: "asc" | "desc"
  }): Promise<Category[] | null> {
    try {
      const finalOrderBy = orderBy ?? "createdAt"
      const finalOrder = order ?? "desc"
      const categories = await this.prismaService.category.findMany({
        where: { deletedAt: null },
        ...(offset !== null ? { skip: offset } : {}),
        ...(limit !== null ? { take: limit } : {}),
        select: {
          id: true,
        },
      })
      if (!categories) {
        return null
      }
      const ids = categories.map((cate) => cate.id)
      const queryCate = await this.prismaService.category.findMany({
        where: { id: { in: ids } },
        orderBy: { [finalOrderBy]: finalOrder },
      })
      if (!queryCate) {
        return null
      }
      const result = queryCate.map((e) => {
        const category = CategoryMapper.toDomain(e)
        return category
      })
      return result ?? null
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async addCategory(category: Category): Promise<void> {
    try {
      const data = CategoryMapper.toPersistence(category)
      const existCategory = await this.getCategoryBySlug(data.slug)
      if (existCategory) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
          message: "Already exist this data",
        })
      }
      await this.prismaService.category.create({ data: data })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async removeCategory(category: Category): Promise<void> {
    try {
      const tagCategories = await this.prismaService.tagsCategories.findMany({
        where: { categoryId: category.id },
      })
      if (tagCategories) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.BAD_REQUEST,
          message: "Still have data refer to this record",
        })
      }
      await this.prismaService.category.delete({ where: { id: category.id } })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async updateCategory(data: Category): Promise<void> {
    try {
      const { id } = data
      let foundCategory = await this.prismaService.category.findFirst({
        where: { id: id },
      })
      if (!foundCategory) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.NOT_FOUND,
          message: "Category not found",
        })
      }
      foundCategory = CategoryMapper.toPersistence(data)
      const updatedCategory = await this.prismaService.category.update({
        where: { id },
        data: foundCategory,
      })
      if (!updatedCategory) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.BAD_REQUEST,
          message: "Update operation not work",
        })
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      const category = await this.prismaService.category.findFirst({
        where: { slug },
      })
      if (!category) {
        return null
      }
      const data = CategoryMapper.toDomain(category)
      return data ?? null
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async getCategoryById(id: string): Promise<Category | null> {
    try {
      const category = await this.prismaService.category.findFirst({
        where: { id },
      })
      if (!category) {
        return null
      }
      const data = CategoryMapper.toDomain(category)
      return data ?? null
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async getCategoriesByTag(tag: Tag): Promise<Category[] | null> {
    try {
      const tagCategories = await this.prismaService.tagsCategories.findMany({
        where: { tagId: tag.id },
      })

      if (!tagCategories || tagCategories.length === 0) {
        return null
      }
      const categories = await Promise.all(
        tagCategories.map(async (e) => {
          const category = await this.prismaService.category.findUnique({
            where: { id: e.categoryId },
          })

          if (!category) {
            return null
          }
          return category
        }),
      )
      if (!categories || categories.length === 0) {
        return null
      }

      const result = categories.map((category) =>
        CategoryMapper.toDomain(category),
      )
      return result ?? null
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async searchCategoriesByKeyword(keyword: string): Promise<Category[]> {
    try {
      const categories = await this.prismaService.category.findMany({
        where: {
          name: {
            contains: keyword,
            mode: "insensitive",
          },
          deletedAt: null,
        },
      })
      if (!categories) {
        return []
      }
      const result = categories.map((c) => CategoryMapper.toDomain(c))
      return result ?? []
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  // async getUserCategories(userId: string): Promise<Category[]> {
  //   try {
  //     const userCategories = await this.prismaService.usersCategories.findMany({
  //       where: { userId },
  //     })
  //     if (!userCategories) return []
  //     const result = await Promise.all(
  //       userCategories.map(async (c) => {
  //         const category = await this.prismaService.category.findUnique({
  //           where: {
  //             id: c.categoryId,
  //           },
  //         })
  //         if (!category) return null
  //         return CategoryMapper.toDomain(category) ?? null
  //       }),
  //     )
  //     return result.filter((e) => e !== null) ?? []
  //   } catch (error) {
  //     if (error instanceof Prisma.PrismaClientKnownRequestError) {
  //       handlePrismaError(error)
  //     }
  //     if (error instanceof InfrastructureError) {
  //       throw error
  //     }

  //     throw new InfrastructureError({
  //       code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
  //       message: error.message,
  //     })
  //   }
  // }
}
