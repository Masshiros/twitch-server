import { Module } from "@nestjs/common"
import { ImageModule } from "src/module/image/application/image.module"
import { NotificationDatabaseModule } from "src/module/notifications/infrastructure/database/notification.database.module"
import { UserDatabaseModule } from "src/module/users/infrastructure/database/user.database.module"
import {
  GatewaySessionManager,
  IGatewaySessionManager,
} from "./gateway.session"

@Module({
  imports: [],
  providers: [
    {
      provide: IGatewaySessionManager,
      useClass: GatewaySessionManager,
    },
  ],
  exports: [
    {
      provide: IGatewaySessionManager,
      useClass: GatewaySessionManager,
    },
  ],
})
export class GatewayModule {}
