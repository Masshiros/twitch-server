import { Logger } from "@nestjs/common"
import { Cron, CronExpression } from "@nestjs/schedule"

export class CronService {
  private readonly logger = new Logger(CronService.name)
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  handleDailyTasks() {
    this.logger.log("Executing daily task at midnight.")
    // Add your task logic here
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  handleFiveMinuteTasks() {
    this.logger.log("Executing task every 10 seconds")
    // Add your task logic here
  }
}
