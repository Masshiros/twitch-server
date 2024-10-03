import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import NodemailerService from "./nodemailer.service"

@Module({
  providers: [NodemailerService],
  exports: [NodemailerService],
})
export class NodeMailerModule {}
