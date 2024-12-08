import { Module } from "@nestjs/common"
import { DatabaseModule } from "prisma/database.module"
import { IChatRepository } from "../../domain/repository/chat.interface.repository"
import { ChatPrismaRepository } from "./prisma/chat.prisma.repository"

@Module({
  imports: [DatabaseModule],
  providers: [{ provide: IChatRepository, useClass: ChatPrismaRepository }],
  exports: [IChatRepository],
})
export class ChatDatabaseModule {}
