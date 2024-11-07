import { Module } from "@nestjs/common"
import { DatabaseModule } from "prisma/database.module"
import { IFriendRepository } from "../../domain/repository/friend.interface.repository"
import { FriendRepository } from "./prisma/friend.repository"

@Module({
  imports: [DatabaseModule],
  providers: [{ provide: IFriendRepository, useClass: FriendRepository }],
  exports: [IFriendRepository],
})
export class FriendsDatabaseModule {}
