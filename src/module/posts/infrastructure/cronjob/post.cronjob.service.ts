import { InjectQueue } from "@nestjs/bullmq"
import { Injectable, Logger, Post } from "@nestjs/common"
import { Cron, CronExpression } from "@nestjs/schedule"
import { Queue } from "bullmq"
import { Bull } from "libs/constants/bull"
import { IPostsRepository } from "../../domain/repository/posts.interface.repository"
import { PostRedisDatabase } from "../database/redis/post.redis.database"

@Injectable()
export class PostCronjobService {
  private readonly logger = new Logger(PostCronjobService.name)
  constructor(
    @InjectQueue(Bull.queue.user_post.schedule) private queue: Queue,
    private readonly postRepository: IPostsRepository,
    private readonly postRedisDatabase: PostRedisDatabase,
  ) {}
  @Cron(CronExpression.EVERY_10_SECONDS)
  async test() {
    this.logger.log("Post cron run")
  }
  @Cron(CronExpression.EVERY_SECOND)
  async handlePostView() {
    this.logger.log("Update post view")
    try {
      const listPostViews = await this.postRedisDatabase.getPostView()
      await Promise.all(
        listPostViews.map(async (e) => {
          const post = await this.postRepository.findPostById(e.postId)
          if (post) {
            post.totalViewCount = e.view
            await this.postRepository.updatePost(post)
          }
        }),
      )
    } catch (error) {}
  }
  @Cron(CronExpression.EVERY_MINUTE)
  async processScheduledPost() {
    this.logger.log("Starting scheduled user post....")

    try {
      const scheduledPosts = await this.postRepository.findDuePosts(new Date())
      if (scheduledPosts.length === 0) {
        this.logger.log("No scheduled post to process")
        return
      }
      for (const scheduledPost of scheduledPosts) {
        try {
          const plainData = {
            id: scheduledPost.id,
            postId: scheduledPost.postId,
            userId: scheduledPost.userId,
            createdAt: scheduledPost.createdAt,
            updatedAt: scheduledPost.updatedAt,
            scheduledAt: scheduledPost.scheduledAt,
          }
          await this.queue.add(Bull.job.user_post.schedule, {
            plainData,
          })
          this.logger.log(`Scheduled post added to queue: ${scheduledPost.id}`)
        } catch (error) {
          this.logger.error(
            `Error processing scheduled post: ${scheduledPost.id}`,
            error.stack,
          )
        }
      }
    } catch (error) {
      this.logger.error("Error in scheduled post processing:", error.stack)
    }
  }
}
