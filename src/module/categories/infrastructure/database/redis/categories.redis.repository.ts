import { Inject, Injectable, Logger } from "@nestjs/common"
import Redis from "ioredis"
import { IORedisKey } from "src/integration/cache/redis/redis.module"
import { Category } from "src/module/categories/domain/entity/categories.entity"
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
      return JSON.parse(data)
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
}
