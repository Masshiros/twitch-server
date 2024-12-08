import { Module } from "@nestjs/common"
import { GatewayModule } from "src/gateway/gateway.module"
import { UserDatabaseModule } from "src/module/users/infrastructure/database/user.database.module"
import { NotificationDatabaseModule } from "../database/notification.database.module"
import { NotificationsGateway } from "./notification.gateway"

@Module({
  imports: [GatewayModule, NotificationDatabaseModule, UserDatabaseModule],
  providers: [NotificationsGateway],
})
export class NotificationGatewayModule {}
