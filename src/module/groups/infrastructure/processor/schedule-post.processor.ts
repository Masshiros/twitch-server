import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq"
import { Logger } from "@nestjs/common"
import { Job } from "bullmq"
import { Bull } from "libs/constants/bull"
import {
  InfrastructureError,
  InfrastructureErrorCode,
} from "libs/exception/infrastructure"
import { IGroupRepository } from "../../domain/repository/group.interface.repository"

@Processor(Bull.queue.post.schedule)
export class SchedulePostProcessor extends WorkerHost {
  private readonly logger = new Logger(SchedulePostProcessor.name)
  constructor(private readonly groupRepository: IGroupRepository) {
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
      const groupPost = await this.groupRepository.findPostById(
        plainData.postId,
      )
      if (!groupPost) {
        this.logger.warn(
          `GroupPost not found for scheduledPostId: ${plainData.postId}`,
        )
        return
      }
      groupPost.isPublic = true
      await Promise.all([
        this.groupRepository.updatePost(groupPost),
        this.groupRepository.deleteScheduledPost(plainData),
      ])
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
