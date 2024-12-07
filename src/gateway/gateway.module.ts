import { Module } from "@nestjs/common"
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
