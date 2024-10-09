import { Module } from "@nestjs/common"
import { DatabaseModule } from "prisma/database.module"
import { IFollowersRepository } from "../../domain/repository/followers.interface.repository"
import { FollowersRepository } from "./prisma/repositories/followers.repository"

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: IFollowersRepository,
      useClass: FollowersRepository,
    },
  ],
  exports: [IFollowersRepository],
})
export class FollowersDatabaseModule {}
