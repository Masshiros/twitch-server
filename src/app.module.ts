import { classes } from "@automapper/classes"
import { AutomapperModule } from "@automapper/nestjs"
import { Module } from "@nestjs/common"
import { UserModule } from "./users/application/user.module"

@Module({
  imports: [
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    UserModule,
  ],
})
export class AppModule {}
