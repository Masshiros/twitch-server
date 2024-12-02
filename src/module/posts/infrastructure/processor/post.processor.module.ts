import { Module } from "@nestjs/common"
import { PostsDatabaseModule } from "../database/posts.database.module"
import { CachePostProcessor } from "./cache-post.processor"
import { PostViewProcessor } from "./post-view.processor"
import { SchedulePostProcessor } from "./schedule-post.processor"

@Module({
  imports: [PostsDatabaseModule],
  providers: [SchedulePostProcessor, CachePostProcessor, PostViewProcessor],
  exports: [SchedulePostProcessor, CachePostProcessor, PostViewProcessor],
})
export class PostProcessorModule {}
