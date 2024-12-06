import { Inject, Injectable } from "@nestjs/common"
import { Redis } from "ioredis"
import { IORedisKey } from "src/integration/cache/redis/redis.module"
import { Comment } from "src/module/posts/domain/entity/comments.entity"
import { Post } from "src/module/posts/domain/entity/posts.entity"
import { EUserPostVisibility } from "src/module/posts/domain/enum/posts.enum"
import { PostFactory } from "src/module/posts/domain/factory/posts.factory"

@Injectable()
export class PostRedisDatabase {
  constructor(@Inject(IORedisKey) private readonly redisClient: Redis) {}

  async savePosts(userId: string, postsData: any[]): Promise<void> {
    const cacheKey = `newPost:${userId}`

    await this.redisClient.del(cacheKey)
    console.log(postsData)
    await this.redisClient.set(cacheKey, JSON.stringify(postsData))
  }

  async createPostView(postId: string): Promise<void> {
    const cacheKey = `postView:${postId}`
    await this.redisClient.incr(cacheKey)
  }
  async getPostView() {
    const keys = await this.redisClient.keys("postView:*")
    const result = await Promise.all(
      keys.map(async (key) => {
        const postId = key.split(":")[1]
        const view = parseInt(await this.redisClient.get(key), 10) || 0
        return { postId, view }
      }),
    )
    return result
  }
  async getPostViewByPostId(postId: string): Promise<number> {
    const cacheKey = `postView:${postId}`
    const viewData = JSON.parse(await this.redisClient.get(cacheKey))

    if (!viewData) {
      return 0
    }
    return parseInt(viewData)
  }
  async invalidatePostView(postId: string): Promise<void> {
    const cacheKey = `postView:${postId}`

    await this.redisClient.del(cacheKey)

    console.log(`View count cache for post ${postId} deleted`)
  }
  async getPostByUserId(userId: string): Promise<Post[]> {
    const cacheKey = `newPost:${userId}`
    const postData = await this.redisClient.get(cacheKey)

    if (!postData) {
      console.log(`Post for user ${userId} not found in cache`)
      return null
    }
    const posts = JSON.parse(postData)
    const result: Post[] = posts.map((p) => this.rehydratePost(p))

    return result !== null ? result : []
  }
  private rehydratePost(data: any): Post {
    return PostFactory.createPost({
      id: data._id,
      userId: data._userId,
      content: data._content,
      visibility: data._visibility ?? EUserPostVisibility.PUBLIC,
      images: data._postImages ?? [],
      totalViewCount: data._totalViewCount ?? 0,
      postReactions: data._postReactions ?? [],
      isPublic: data._isPublic ?? true,
      createdAt: data._createdAt,
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
  async saveComments(postId: string, commentsData: any[]): Promise<void> {
    const cacheKey = `postComments:${postId}`
    await this.redisClient.del(cacheKey)
    console.log(commentsData)
    await this.redisClient.set(cacheKey, JSON.stringify(commentsData))
  }
  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    const cacheKey = `postComments:${postId}`
    const commentData = await this.redisClient.get(cacheKey)

    if (!commentData) {
      console.log(`Comments for post ${postId} not found in cache`)
      return []
    }

    const comments = JSON.parse(commentData)
    const result: Comment[] = comments.map((c) => this.rehydrateComment(c))

    return result
  }

  private rehydrateComment(data: any): Comment {
    return PostFactory.createComment({
      id: data._id,
      postId: data._postId,
      userId: data._userId,
      parentId: data._parentId,
      content: data._content,
      createdAt: data._createdAt,
      updatedAt: data._updatedAt,
      deletedAt: data._deletedAt,
    })
  }
  async deleteComment(postId: string, commentId: string): Promise<void> {
    const cacheKey = `postComments:${postId}`
    const commentData = await this.redisClient.get(cacheKey)

    if (!commentData) {
      console.log(`Comments for post ${postId} not found in cache`)
      return
    }

    const comments = JSON.parse(commentData)
    const updatedComments = comments.filter(
      (comment: any) => comment._id !== commentId,
    )

    await this.redisClient.set(cacheKey, JSON.stringify(updatedComments))
    console.log(`Comment ${commentId} deleted from cache for post ${postId}`)
  }
  async invalidateComments(postId: string): Promise<void> {
    const cacheKey = `postComments:${postId}`
    await this.redisClient.del(cacheKey)
  }
}
