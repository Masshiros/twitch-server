import { BullModule } from "@nestjs/bullmq"
import { Module } from "@nestjs/common"
import { ScheduleModule } from "@nestjs/schedule"
import { Bull } from "libs/constants/bull"
import { GroupDatabaseModule } from "src/module/groups/infrastructure/database/group.database.module"
import { GroupProcessorModule } from "../processor/group.processor.module"
import { GroupCronjobService } from "./group.cronjob.service"

@Module({
  imports: [
    ScheduleModule.forRoot(),
    GroupDatabaseModule,
    BullModule.registerQueue({
      name: Bull.queue.post.schedule,
    }),
    GroupProcessorModule,
  ],
  providers: [GroupCronjobService],
  exports: [GroupCronjobService],
})
export class GroupCronModule {}
