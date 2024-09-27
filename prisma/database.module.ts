import { Module } from "@nestjs/common"
import { IUserRepository } from "src/users/domain/repository/user"
import { PrismaUserRepository } from "../src/users/infrastructure/database/prisma/repositories/user.prisma.repository"
import { PrismaService } from "./prisma.service"

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
