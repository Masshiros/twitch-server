import { Module } from "@nestjs/common"
import { ITokenRepository } from "src/users/domain/repository/token"
import { IUserRepository } from "src/users/domain/repository/user"
import { PrismaService } from "./prisma/prisma.service"
import { PrismaTokenRepository } from "./prisma/repositories/token.prisma.repository"
import { PrismaUserRepository } from "./prisma/repositories/user.prisma.repository"

@Module({
  providers: [
    PrismaService,
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: ITokenRepository,
      useClass: PrismaTokenRepository,
    },
  ],
  exports: [IUserRepository, ITokenRepository],
})
export class DatabaseModule {}
