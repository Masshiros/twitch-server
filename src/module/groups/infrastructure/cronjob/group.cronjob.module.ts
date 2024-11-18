import { Module } from "@nestjs/common"
import { ScheduleModule } from "@nestjs/schedule"
import { GroupDatabaseModule } from "src/module/groups/infrastructure/database/group.database.module"
import { GroupCronjobService } from "./group.cronjob.service"

@Module({
  imports: [ScheduleModule.forRoot(), GroupDatabaseModule],
  providers: [GroupCronjobService],
  exports: [GroupCronjobService],
})
export class GroupCronModule {}
