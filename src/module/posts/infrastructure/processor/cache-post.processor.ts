import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq"
import { Logger } from "@nestjs/common"
import { Job } from "bullmq"
import { Bull } from "libs/constants/bull"
import {
  InfrastructureError,
  InfrastructureErrorCode,
} from "libs/exception/infrastructure"
import { PostRedisDatabase } from "../database/redis/post.redis.database"

@Processor(Bull.queue.user_post.cache_post)
export class CachePostProcessor extends WorkerHost {
  private logger = new Logger(CachePostProcessor.name)
  constructor(private readonly postRedisDatabase: PostRedisDatabase) {
    super()
  }
  @OnWorkerEvent("active")
  onQueueActive(job: Job) {
    this.logger.log(`Job has been started: ${job.id}`)
  }

  @OnWorkerEvent("completed")
  onQueueComplete(job: Job, result: any) {
    this.logger.log(`Job has been finished: ${job.id}`)
  }

  @OnWorkerEvent("failed")
  onQueueFailed(job: Job, error: any) {
    this.logger.log(`Job has been failed: ${job.id}`)
    throw new Error(`Image upload failed: ${error.message}`)
  }
  async process(job: Job, token?: string): Promise<any> {
    const { userId, posts } = job.data
    try {
      await this.postRedisDatabase.savePosts(userId, posts)
    } catch (error) {
      this.logger.error(`Error processing post cache: ${error.message}`)
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
}
