import { Module } from "@nestjs/common"
import { GatewayModule } from "src/gateway/gateway.module"
import { ChatGateway } from "./chat.gateway"

@Module({ imports: [GatewayModule], providers: [ChatGateway] })
export class ChatGatewayModule {}
