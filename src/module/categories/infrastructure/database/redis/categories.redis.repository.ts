import { Inject, Injectable, Logger } from "@nestjs/common"
import Redis from "ioredis"
import { IORedisKey } from "src/integration/cache/redis/redis.module"
import { Category } from "src/module/categories/domain/entity/categories.entity"
import { CategoriesFactory } from "src/module/categories/domain/factory/categories.factory"
import { ICategoriesRepository } from "src/module/categories/domain/repository/categories.interface.repository"

@Injectable()
export class CategoriesRedisRepository {
  private readonly CATEGORY_KEY = "categories"
  private readonly logger = new Logger(CategoriesRedisRepository.name)
  constructor(@Inject(IORedisKey) private readonly redisClient: Redis) {}
  async getCategories(
    limit: number,
    offset: number,
    orderBy: string,
    order: "asc" | "desc",
  ): Promise<Category[] | null> {
    try {
      const cacheKey = `${this.CATEGORY_KEY}:limit=${limit}:offset=${offset}:orderBy=${orderBy}:order=${order}`

      const data = await this.redisClient.get(cacheKey)
      if (!data) return null
      const parsedData = JSON.parse(data)
      const categories = parsedData.map((item: any) =>
        this.rehydrateCategory(item),
      )
      return categories
    } catch (error) {
      this.logger.error("Failed to get categories from Redis", error)
      return null
    }
  }
  async storeCategory(
    categories: Category[],
    limit: number,
    offset: number,
    orderBy: string,
    order: "asc" | "desc",
  ): Promise<void> {
    const cacheKey = `${this.CATEGORY_KEY}:limit=${limit}:offset=${offset}:orderBy=${orderBy}:order=${order}`
    await this.redisClient.set(`${cacheKey}`, JSON.stringify(categories))
  }

  async invalidateCache(): Promise<void> {
    await this.redisClient.del(this.CATEGORY_KEY)
    this.logger.log("Category cache invalidated")
  }
  private rehydrateCategory(data: any): Category {
    return CategoriesFactory.createCategory({
      id: data._id,
      name: data._name,
      slug: data._slug,
      currentTotalView: data._currentTotalView,
      image: data._image,
      applicableTo: data._applicableTo,
      createdAt: new Date(data._createdAt),
      updatedAt: new Date(data._updatedAt),
      deletedAt: data._deletedAt ? new Date(data._deletedAt) : null,
      numberOfFollowers: data._numberOfFollowers,
    })
  }
}
