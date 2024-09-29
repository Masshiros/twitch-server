import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { validate } from "libs/config"
import { UserModule } from "./users/application/user.module"

@Module({
  imports: [ConfigModule.forRoot({ validate: validate }), UserModule],
})
export class AppModule {}
