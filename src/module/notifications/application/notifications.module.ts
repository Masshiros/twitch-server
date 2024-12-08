import { Module } from "@nestjs/common"
import { CqrsModule } from "@nestjs/cqrs"
import { UserDatabaseModule } from "src/module/users/infrastructure/database/user.database.module"
import { NotificationDatabaseModule } from "../infrastructure/database/notification.database.module"
import { NotificationsController } from "../presentation/notifications.controller"
import { MarkAsReadHandler } from "./command/mark-as-read/mark-as-read.handler"
import { NotificationsService } from "./notifications.service"

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, MarkAsReadHandler],
  imports: [CqrsModule, NotificationDatabaseModule, UserDatabaseModule],
})
export class NotificationsModule {}
