import { Inject, Injectable } from "@nestjs/common"
import { Redis } from "ioredis"
import { IORedisKey } from "src/integration/cache/redis/redis.module"

@Injectable()
export class PostRedisDatabase {
  constructor(@Inject(IORedisKey) private readonly redisClient: Redis) {}

  async createNewPost(userId: string, postData: any): Promise<void> {
    const cacheKey = `newPost:${userId}`

    const existingPostsJson = await this.redisClient.get(cacheKey)

    let existingPosts = []
    if (existingPostsJson) {
      existingPosts = JSON.parse(existingPostsJson)
      console.log(existingPosts)
    }
    existingPosts.push({
      ...postData,
    })

    await this.redisClient.set(cacheKey, JSON.stringify(existingPosts))
    console.log(`Post for user ${userId} cached with key ${cacheKey}`)
  }
  async getPostByUserId(userId: string): Promise<any> {
    const cacheKey = `newPost:${userId}`
    const postData = await this.redisClient.get(cacheKey)

    if (!postData) {
      console.log(`Post for user ${userId} not found in cache`)
      return null
    }

    console.log(`Post for user ${userId} fetched from cache`)
    return JSON.parse(postData)
  }

  async deletePostByUserId(userId: string): Promise<void> {
    const cacheKey = `newPost:${userId}`
    await this.redisClient.del(cacheKey)
    console.log(`Post for user ${userId} deleted from cache`)
  }

  async clearAllPosts(): Promise<void> {
    const keys = await this.redisClient.keys("newPost:*")
    if (keys.length) {
      await this.redisClient.del(...keys)
      console.log(`All posts deleted from cache`)
    }
  }
}
