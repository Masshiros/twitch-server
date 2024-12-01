import { Module } from "@nestjs/common"
import { PostsDatabaseModule } from "../database/posts.database.module"
import { CachePostProcessor } from "./cache-post.processor"
import { SchedulePostProcessor } from "./schedule-post.processor"

@Module({
  imports: [PostsDatabaseModule],
  providers: [SchedulePostProcessor, CachePostProcessor],
  exports: [SchedulePostProcessor, CachePostProcessor],
})
export class PostProcessorModule {}
