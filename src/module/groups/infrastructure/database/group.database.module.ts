import { Module } from "@nestjs/common"
import { DatabaseModule } from "prisma/database.module"
import { IGroupRepository } from "../../domain/repository/group.interface.repository"
import { GroupPrismaRepository } from "./prisma/group.prisma.repository"

@Module({
  imports: [DatabaseModule],
  providers: [{ provide: IGroupRepository, useClass: GroupPrismaRepository }],
  exports: [IGroupRepository],
})
export class GroupDatabaseModule {}
