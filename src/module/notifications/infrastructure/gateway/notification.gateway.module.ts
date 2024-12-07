import { Module } from "@nestjs/common"
import { GatewayModule } from "src/gateway/gateway.module"
import { NotificationDatabaseModule } from "../database/notification.database.module"
import { NotificationsGateway } from "./notification.gateway"

@Module({
  imports: [GatewayModule, NotificationDatabaseModule],
  providers: [NotificationsGateway],
})
export class NotificationGatewayModule {}
