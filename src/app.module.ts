import { classes } from "@automapper/classes"
import { AutomapperModule } from "@automapper/nestjs"
import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { validate } from "libs/config"
import { UserModule } from "./users/application/user.module"

@Module({
  imports: [
    ConfigModule.forRoot({ validate }),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    UserModule,
  ],
})
export class AppModule {}
