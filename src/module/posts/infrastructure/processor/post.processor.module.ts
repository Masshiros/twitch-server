import { Module } from "@nestjs/common"
import { PostsDatabaseModule } from "../database/posts.database.module"
import { CacheCommentProcessor } from "./cache-comment.processor"
import { CachePostProcessor } from "./cache-post.processor"
import { PostViewProcessor } from "./post-view.processor"
import { SchedulePostProcessor } from "./schedule-post.processor"

@Module({
  imports: [PostsDatabaseModule],
  providers: [
    SchedulePostProcessor,
    CachePostProcessor,
    PostViewProcessor,
    CacheCommentProcessor,
  ],
  exports: [
    SchedulePostProcessor,
    CachePostProcessor,
    PostViewProcessor,
    CacheCommentProcessor,
  ],
})
export class PostProcessorModule {}
