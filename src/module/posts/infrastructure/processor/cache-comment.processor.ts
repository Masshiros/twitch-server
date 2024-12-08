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
import { IFollowersRepository } from "src/module/followers/domain/repository/followers.interface.repository"
import { IFriendRepository } from "src/module/friends/domain/repository/friend.interface.repository"
import { ENotification } from "src/module/notifications/domain/enum/notification.enum"
import { NotificationEmittedEvent } from "src/module/notifications/domain/events/notification-emitted.events"
import { NotificationFactory } from "src/module/notifications/domain/factory/notification.factory"
import { INotificationRepository } from "src/module/notifications/domain/repositories/notification.interface.repository"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { IPostsRepository } from "../../domain/repository/posts.interface.repository"
import { PostRedisDatabase } from "../database/redis/post.redis.database"

@Processor(Bull.queue.user_post.cache_comment)
export class CacheCommentProcessor extends WorkerHost {
  private logger = new Logger(CacheCommentProcessor.name)

  constructor(
    private readonly emitter: EventEmitter2,
    private readonly postRedisDatabase: PostRedisDatabase,
    private readonly postDatabase: IPostsRepository,
    private readonly userRepository: IUserRepository,
    private readonly notificationRepository: INotificationRepository,
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
    this.logger.log(`Job has failed: ${job.id}`)
    throw new Error(`Comment cache failed: ${error.message}`)
  }

  async process(job: Job, token?: string): Promise<any> {
    const { postId, comments, userId } = job.data
    try {
      await this.postRedisDatabase.saveComments(postId, comments)
      const [post, user] = await Promise.all([
        this.postDatabase.findPostById(postId),
        this.userRepository.findById(userId),
      ])
      const notification = NotificationFactory.create({
        senderId: userId,
        title: `New comment from ${user.name} `,
        message: `${user.name} has commented on your post`,
        type: ENotification.USER,
        createdAt: new Date(),
      })
      await this.notificationRepository.addNotification(notification)
      this.emitter.emit(
        Events.notification,
        new NotificationEmittedEvent([post.userId], notification),
      )
    } catch (error) {
      this.logger.error(
        `Error processing comment cache for post ${postId}: ${error.message}`,
      )
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
}
