import { InjectQueue } from "@nestjs/bullmq"
import { Injectable } from "@nestjs/common"
import { OnEvent } from "@nestjs/event-emitter"
import { Queue } from "bullmq"
import { Bull } from "libs/constants/bull"
import { Events } from "libs/constants/events"
import {
  CommandError,
  CommandErrorCode,
} from "libs/exception/application/command"
import { ImageService } from "src/module/image/application/image.service"
import { ImagesUploadedEvent } from "src/module/image/domain/event/images-uploaded.event"
import { Post } from "../../domain/entity/posts.entity"
import { CommentCreateEvent } from "../../domain/events/comment-create.event"
import { CommentUpdateEvent } from "../../domain/events/comment-update.event"
import { PostCreateEvent } from "../../domain/events/post-create.event"
import { PostDeleteEvent } from "../../domain/events/post-delete.event"
import { IPostsRepository } from "../../domain/repository/posts.interface.repository"
import { PostRedisDatabase } from "../database/redis/post.redis.database"

@Injectable()
export class PostListener {
  constructor(
    private readonly postRepository: IPostsRepository,
    @InjectQueue(Bull.queue.user_post.cache_post)
    private readonly cachePostProcessorQueue: Queue,
    @InjectQueue(Bull.queue.user_post.cache_comment)
    private readonly cacheCommentProcessorQueue: Queue,
    private readonly postRedisDatabase: PostRedisDatabase,
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
    let existingPosts = await this.postRedisDatabase.getPostByUserId(
      post.userId,
    )
    existingPosts = existingPosts !== null ? existingPosts : []
    console.log(existingPosts)
    if (existingPosts !== null || existingPosts.length > 0) {
      const postIndex = existingPosts.findIndex((e) => e.id === post.id)
      if (postIndex !== -1) {
        existingPosts[postIndex] = {
          ...existingPosts[postIndex],
          ...post,
        } as Post
      } else {
        existingPosts.push(post)
      }
    } else {
      existingPosts.push(post)
    }
    const [job, failedUploadJobs] = await Promise.all([
      this.cachePostProcessorQueue.add(Bull.job.user_post.cache_post, {
        userId: post.userId,
        posts: existingPosts,
        postId: post.id,
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
  @OnEvent(Events.post.create)
  async handlePostCreate(event: PostCreateEvent) {
    const { post } = event
    let existingPosts = await this.postRedisDatabase.getPostByUserId(
      post.userId,
    )
    existingPosts = existingPosts !== null ? existingPosts : []
    existingPosts.push(post)
    // console.log(existingPosts)
    const [job, failedUploadJobs] = await Promise.all([
      this.cachePostProcessorQueue.add(Bull.job.user_post.cache_post, {
        userId: post.userId,
        posts: existingPosts,
        postId: post.id,
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
  @OnEvent(Events.post.update)
  async handlePostUpdate(event: PostCreateEvent) {
    const { post } = event
    let existingPosts = await this.postRedisDatabase.getPostByUserId(
      post.userId,
    )
    existingPosts = existingPosts !== null ? existingPosts : []
    console.log(existingPosts)
    const postIndex = existingPosts.findIndex((e) => e.id === post.id)
    if (postIndex !== -1) {
      existingPosts[postIndex] = {
        ...existingPosts[postIndex],
        ...post,
      } as Post
    }
    const [job, failedUploadJobs] = await Promise.all([
      this.cachePostProcessorQueue.add(Bull.job.user_post.cache_post, {
        userId: post.userId,
        posts: existingPosts,
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
  @OnEvent(Events.post.delete)
  async handleDeletePost(event: PostDeleteEvent) {
    const { post } = event
    const existingPosts = await this.postRedisDatabase.getPostByUserId(
      post.userId,
    )
    const updatedPosts = existingPosts.filter((e) => e.id !== post.id)
    const [job, failedUploadJobs] = await Promise.all([
      this.cachePostProcessorQueue.add(Bull.job.user_post.cache_post, {
        userId: post.userId,
        posts: updatedPosts,
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
  @OnEvent(Events.comment.create)
  async handleCommentCreate(event: CommentCreateEvent) {
    const { comment } = event
    console.log(event)
    let existingComments = await this.postRedisDatabase.getCommentsByPostId(
      comment.postId,
    )
    console.log("EXISTING 1 ", existingComments)
    existingComments = existingComments !== null ? existingComments : []
    console.log("EXISTING 2", existingComments)
    existingComments.push(comment)
    console.log("EXISTING 3", existingComments)
    // console.log(existingComments)
    const [job, failedUploadJobs] = await Promise.all([
      this.cacheCommentProcessorQueue.add(Bull.job.user_post.cache_comment, {
        postId: comment.postId,
        comments: existingComments,
        userId: comment.userId,
      }),
      this.cacheCommentProcessorQueue.getFailed(),
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
