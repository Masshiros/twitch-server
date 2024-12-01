import { Inject, Injectable } from "@nestjs/common"
import { Redis } from "ioredis"
import { IORedisKey } from "src/integration/cache/redis/redis.module"
import { Post } from "src/module/posts/domain/entity/posts.entity"
import { EUserPostVisibility } from "src/module/posts/domain/enum/posts.enum"
import { PostFactory } from "src/module/posts/domain/factory/posts.factory"

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
    const posts = JSON.parse(postData)
    const result = posts.map((p) => this.rehydratePost(p))
    return result
  }
  private rehydratePost(data: any): Post {
    return PostFactory.createPost({
      id: data._id,
      userId: data._userId,
      content: data._content,
      visibility: data._visibility || EUserPostVisibility.PUBLIC,
      images: data._postImages || [],
      totalViewCount: data._totalViewCount || 0,
      postReactions: data._postReactions || [],
      isPublic: data._isPublic || true,
    })
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
