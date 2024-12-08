import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq"
import { Logger } from "@nestjs/common"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { Job } from "bullmq"
import { Bull } from "libs/constants/bull"
import { Events } from "libs/constants/events"
import {
  InfrastructureError,
  InfrastructureErrorCode,
} from "libs/exception/infrastructure"
import { PostUpdateEvent } from "../../domain/events/post-update.event"
import { IPostsRepository } from "../../domain/repository/posts.interface.repository"

@Processor(Bull.queue.user_post.schedule)
export class SchedulePostProcessor extends WorkerHost {
  private readonly logger = new Logger(SchedulePostProcessor.name)
  constructor(
    private readonly postRepository: IPostsRepository,
    private readonly emitter: EventEmitter2,
  ) {
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
    if (error instanceof InfrastructureError) {
      throw error
    }

    throw new InfrastructureError({
      code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
      message: error.message,
    })
  }
  async process(job: Job, token?: string): Promise<any> {
    const { plainData } = job.data
    // console.log(plainData)
    try {
      const post = await this.postRepository.findPostById(plainData.postId)
      if (!post) {
        this.logger.warn(
          `Post not found for scheduledPostId: ${plainData.postId}`,
        )
        return
      }
      post.isPublic = true
      await Promise.all([
        this.postRepository.updatePost(post),
        this.postRepository.deleteScheduledPost(plainData),
      ])
      this.emitter.emit(Events.post.update, new PostUpdateEvent(post))
      this.logger.log(`Processed scheduled post: ${plainData.id}`)
    } catch (error) {
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
}
