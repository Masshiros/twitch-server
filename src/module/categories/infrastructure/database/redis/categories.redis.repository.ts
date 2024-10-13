import { Inject, Logger } from "@nestjs/common"
import Redis from "ioredis"
import { IORedisKey } from "src/integration/cache/redis/redis.module"
import { Category } from "src/module/categories/domain/entity/categories.entity"
import { ICategoriesRepository } from "src/module/categories/domain/repository/categories.interface.repository"

export class CategoriesRedisRepository {
  private readonly CATEGORY_KEY = "categories"
  private readonly logger = new Logger(CategoriesRedisRepository.name)
  constructor(@Inject(IORedisKey) private readonly redisClient: Redis) {}
  async getCategories(): Promise<Category[] | null> {
    try {
      const data = await this.redisClient.get(this.CATEGORY_KEY)
      if (!data) return null
      return JSON.parse(data)
    } catch (error) {
      this.logger.error("Failed to get categories from Redis", error)
      return null
    }
  }
  async storeCategory(categories: Category[]): Promise<void> {
    await this.redisClient.set(
      `${this.CATEGORY_KEY}`,
      JSON.stringify(categories),
    )
  }

  async invalidateCache(): Promise<void> {
    await this.redisClient.del(this.CATEGORY_KEY)
    this.logger.log("Category cache invalidated")
  }
}
