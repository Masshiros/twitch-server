import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { validate } from "libs/config"
import { UserModule } from "./users/application/user.module"

@Module({
  imports: [
    ConfigModule.forRoot({ validate: validate, isGlobal: true }),
    UserModule,
  ],
})
export class AppModule {}
