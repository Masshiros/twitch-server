import { Module } from "@nestjs/common"
import { DatabaseModule } from "prisma/database.module"
import { IPostsRepository } from "../../domain/repository/posts.interface.repository"
import { PostsRepository } from "./prisma/repositories/posts.prisma.repository"

@Module({
  imports: [DatabaseModule],
  providers: [{ provide: IPostsRepository, useClass: PostsRepository }],
  exports: [IPostsRepository],
})
export class PostsDatabaseModule {}
