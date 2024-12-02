import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq"
import { Inject, Logger } from "@nestjs/common"
import { Job } from "bullmq"
import { Bull } from "libs/constants/bull"
import {
  InfrastructureError,
  InfrastructureErrorCode,
} from "libs/exception/infrastructure"
import { PostRedisDatabase } from "../database/redis/post.redis.database"

@Processor(Bull.queue.user_post.post_view)
export class PostViewProcessor extends WorkerHost {
  private logger = new Logger(PostViewProcessor.name)

  constructor(private readonly postRedisDatabase: PostRedisDatabase) {
    super()
  }

  @OnWorkerEvent("completed")
  onQueueComplete(job: Job, result: any) {
    this.logger.log(`Job ${job.id} completed: ${result}`)
  }

  @OnWorkerEvent("failed")
  onQueueFailed(job: Job, error: any) {
    this.logger.error(`Job ${job.id} failed: ${error.message}`)
  }

  async process(job: Job): Promise<any> {
    const { postId } = job.data
    try {
      await this.postRedisDatabase.createPostView(postId)
    } catch (error) {
      this.logger.error(`Error processing post view cache: ${error.message}`)
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
}
