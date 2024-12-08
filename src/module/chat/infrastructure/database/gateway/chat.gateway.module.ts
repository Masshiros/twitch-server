import { Module } from "@nestjs/common"
import { GatewayModule } from "src/module/gateway/gateway.module"
import { ChatGateway } from "./chat.gateway"

@Module({ imports: [GatewayModule], providers: [ChatGateway] })
export class ChatGatewayModule {}
