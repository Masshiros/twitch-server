import { Module } from "@nestjs/common"
import { GatewayModule } from "src/gateway/gateway.module"
import { ImageModule } from "src/module/image/application/image.module"
import { ImageService } from "src/module/image/application/image.service"
import { UserDatabaseModule } from "src/module/users/infrastructure/database/user.database.module"
import { NotificationDatabaseModule } from "../database/notification.database.module"
import { NotificationsGateway } from "./notification.gateway"

@Module({
  imports: [
    GatewayModule,
    NotificationDatabaseModule,
    UserDatabaseModule,
    ImageModule,
  ],
  providers: [NotificationsGateway],
})
export class NotificationGatewayModule {}
