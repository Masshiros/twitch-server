import { Module } from "@nestjs/common"
import { IUserRepository } from "src/users/domain/repository/user"
import { PrismaService } from "./prisma/prisma.service"
import { PrismaUserRepository } from "./prisma/repositories/user.prisma.repository"

@Module({
  providers: [
    PrismaService,
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [IUserRepository],
})
export class DatabaseModule {}
