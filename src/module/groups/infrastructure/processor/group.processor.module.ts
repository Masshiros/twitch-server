import { Module } from "@nestjs/common"
import { GroupDatabaseModule } from "../database/group.database.module"
import { SchedulePostProcessor } from "./schedule-post.processor"

@Module({
  imports: [GroupDatabaseModule],
  providers: [SchedulePostProcessor],
  exports: [SchedulePostProcessor],
})
export class GroupProcessorModule {}
