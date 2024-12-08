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
import { PostRedisDatabase } from "../database/redis/post.redis.database"

@Processor(Bull.queue.user_post.cache_post)
export class CachePostProcessor extends WorkerHost {
  private logger = new Logger(CachePostProcessor.name)
  constructor(
    private readonly emitter: EventEmitter2,
    private readonly postRedisDatabase: PostRedisDatabase,
    private readonly followingRepository: IFollowersRepository,
    private readonly friendRepository: IFriendRepository,
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
    this.logger.log(`Job has been failed: ${job.id}`)
    throw new Error(`Image upload failed: ${error.message}`)
  }
  async process(job: Job, token?: string): Promise<any> {
    const { userId, posts } = job.data
    try {
      await this.postRedisDatabase.savePosts(userId, posts)
      const user = await this.userRepository.findById(userId)
      const [followers, friends] = await Promise.all([
        this.followingRepository.findFollowersByUser(userId),
        this.friendRepository.getFriends(user),
      ])
      const followerIds = followers.map((e) => e.sourceUserId)
      const friendIds = friends.map((e) => e.friendId)
      const ids = [...followerIds, ...friendIds]
      const notification = NotificationFactory.create({
        senderId: userId,
        title: "New post",
        message: "New post from ${user.name}",
        type: ENotification.USER,
        createdAt: new Date(),
      })
      await this.notificationRepository.addNotification(notification)
      this.emitter.emit(
        Events.notification,
        new NotificationEmittedEvent(ids, notification),
      )
    } catch (error) {
      this.logger.error(`Error processing post cache: ${error.message}`)
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
}
