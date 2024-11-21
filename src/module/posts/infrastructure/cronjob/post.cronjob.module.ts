import { BullModule } from "@nestjs/bullmq"
import { Module } from "@nestjs/common"
import { ScheduleModule } from "@nestjs/schedule"
import { Bull } from "libs/constants/bull"
import { PostsDatabaseModule } from "../database/posts.database.module"
import { PostProcessorModule } from "../processor/post.processor.module"
import { PostCronjobService } from "./post.cronjob.service"

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PostsDatabaseModule,
    BullModule.registerQueue({ name: Bull.queue.user_post.schedule }),
    PostProcessorModule,
  ],
  providers: [PostCronjobService],
  exports: [PostCronjobService],
})
export class PostCronModule {}
