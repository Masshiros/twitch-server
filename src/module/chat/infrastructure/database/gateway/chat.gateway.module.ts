import { Module } from "@nestjs/common"
import { GatewayModule } from "src/gateway/gateway.module"
import { ImageModule } from "src/module/image/application/image.module"
import { NotificationDatabaseModule } from "src/module/notifications/infrastructure/database/notification.database.module"
import { UserDatabaseModule } from "src/module/users/infrastructure/database/user.database.module"
import { ChatGateway } from "./chat.gateway"

@Module({
  imports: [
    NotificationDatabaseModule,
    UserDatabaseModule,
    ImageModule,
    GatewayModule,
  ],
  providers: [ChatGateway],
})
export class ChatGatewayModule {}
