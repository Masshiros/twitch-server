import { Module } from "@nestjs/common"
import { JwtModule, JwtService } from "@nestjs/jwt"
import { DatabaseModule } from "prisma/database.module"
import { PrismaService } from "prisma/prisma.service"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { PrismaUserRepository } from "./prisma/repositories/user.prisma.repository"

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: "60s" },
    }),
  ],
  providers: [
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [IUserRepository],
})
export class UserDatabaseModule {}
