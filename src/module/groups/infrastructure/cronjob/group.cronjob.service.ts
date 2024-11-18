import { Injectable, Logger } from "@nestjs/common"
import { Cron, CronExpression } from "@nestjs/schedule"
import { IGroupRepository } from "../../domain/repository/group.interface.repository"

@Injectable()
export class GroupCronjobService {
  private readonly logger = new Logger(GroupCronjobService.name)

  constructor(private readonly groupRepository: IGroupRepository) {}
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
          const groupPost = await this.groupRepository.findPostById(
            scheduledPost.postId,
          )
          if (!groupPost) {
            this.logger.warn(
              `GroupPost not found for scheduledPostId: ${scheduledPost.id}`,
            )
            continue
          }
          groupPost.isPublic = true
          await Promise.all([
            this.groupRepository.updatePost(groupPost),
            this.groupRepository.deleteScheduledPost(scheduledPost),
          ])
          this.logger.log(`Processed scheduled post: ${scheduledPost.id}`)
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
