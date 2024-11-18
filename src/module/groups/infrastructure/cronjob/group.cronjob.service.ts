import { InjectQueue } from "@nestjs/bullmq"
import { Injectable, Logger } from "@nestjs/common"
import { Cron, CronExpression } from "@nestjs/schedule"
import { Queue } from "bullmq"
import { Bull } from "libs/constants/bull"
import { IGroupRepository } from "../../domain/repository/group.interface.repository"

@Injectable()
export class GroupCronjobService {
  private readonly logger = new Logger(GroupCronjobService.name)

  constructor(
    @InjectQueue(Bull.queue.post.schedule) private queue: Queue,
    private readonly groupRepository: IGroupRepository,
  ) {}
  @Cron(CronExpression.EVERY_10_SECONDS)
  async test() {
    this.logger.log("Group cron run")
  }
  @Cron(CronExpression.EVERY_MINUTE)
  async processScheduledPost() {
    this.logger.log("Starting scheduled post processing...")
    try {
      const scheduledPosts = await this.groupRepository.findDuePosts(new Date())
      if (scheduledPosts.length === 0) {
        this.logger.log("No scheduled post to process")
        return
      }
      for (const scheduledPost of scheduledPosts) {
        try {
          const plainData = {
            id: scheduledPost.id,
            postId: scheduledPost.postId,
            groupId: scheduledPost.groupId,
            userId: scheduledPost.userId,
            createdAt: scheduledPost.createdAt,
            updatedAt: scheduledPost.updatedAt,
            scheduledAt: scheduledPost.scheduledAt,
          }
          await this.queue.add(Bull.job.post.schedule, {
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
    } catch (err) {
      this.logger.error("Error in scheduled post processing:", err.stack)
    }
  }
}
