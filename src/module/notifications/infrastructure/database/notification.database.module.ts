import { Module } from "@nestjs/common"
import { DatabaseModule } from "prisma/database.module"
import { INotificationRepository } from "../../domain/repositories/notification.interface.repository"
import { NotifcationRepository } from "./prisma/repositories/notification.repository"

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: INotificationRepository,
      useClass: NotifcationRepository,
    },
  ],
  exports: [],
})
export class NotifcationDatabaseModule {}
