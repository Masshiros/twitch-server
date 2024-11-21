import { Module } from "@nestjs/common"
import { PostsDatabaseModule } from "../database/posts.database.module"
import { SchedulePostProcessor } from "./schedule-post.processor"

@Module({
  imports: [PostsDatabaseModule],
  providers: [SchedulePostProcessor],
  exports: [SchedulePostProcessor],
})
export class PostProcessorModule {}
