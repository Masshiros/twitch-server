import { Module } from "@nestjs/common"
import { DatabaseModule } from "prisma/database.module"
import { INotificationRepository } from "../../domain/repositories/notification.interface.repository"
import { NotificationRepository } from "./prisma/repositories/notification.repository"

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: INotificationRepository,
      useClass: NotificationRepository,
    },
  ],
  exports: [INotificationRepository],
})
export class NotificationDatabaseModule {}
