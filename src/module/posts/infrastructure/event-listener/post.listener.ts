import { InjectQueue } from "@nestjs/bullmq"
import { Injectable } from "@nestjs/common"
import { OnEvent } from "@nestjs/event-emitter"
import { Queue } from "bullmq"
import { Bull } from "libs/constants/bull"
import { Events } from "libs/constants/events"
import { ImageService } from "src/module/image/application/image.service"
import { ImagesUploadedEvent } from "src/module/image/domain/event/images-uploaded.event"
import { IPostsRepository } from "../../domain/repository/posts.interface.repository"
import { PostRedisDatabase } from "../database/redis/post.redis.database"
import { CommandError, CommandErrorCode } from "libs/exception/application/command"

@Injectable()
export class PostListener {
  constructor(
    private readonly postRepository: IPostsRepository,
    @InjectQueue(Bull.queue.user_post.cache_post)
    private readonly cachePostProcessorQueue: Queue,
  ) {}

  @OnEvent(Events.image.multiple_upload)
  async handleImageUploaded(event: ImagesUploadedEvent) {
    const { imageUrl, applicableId } = event

    const post = await this.postRepository.findPostById(applicableId)

    if (!post) {
      console.log(`Post with ID ${applicableId} not found`)
      return
    }
    post.postImages = imageUrl ?? []
    console.log(post.postImages)
    const [job, failedUploadJobs] = await Promise.all([
      this.cachePostProcessorQueue.add(Bull.job.user_post.cache_post, {
        userId: post.userId,
        post,
      }),
      this.cachePostProcessorQueue.getFailed(),
    ])
    if ((await job.getState()) === "failed") {
      if (failedUploadJobs || failedUploadJobs.length !== 0) {
        failedUploadJobs.map((failedJob) => {
          throw new CommandError({
            code: CommandErrorCode.INTERNAL_SERVER_ERROR,
            message: failedJob.failedReason,
          })
        })
      }
    }
  }
}
