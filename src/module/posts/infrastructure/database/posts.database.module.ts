import { Module } from "@nestjs/common"
import { DatabaseModule } from "prisma/database.module"
import { redisModule } from "src/integration/cache/redis/module.config"
import { IPostsRepository } from "../../domain/repository/posts.interface.repository"
import { PostsRepository } from "./prisma/repositories/posts.prisma.repository"
import { PostRedisDatabase } from "./redis/post.redis.database"

@Module({
  imports: [DatabaseModule, redisModule],
  providers: [
    { provide: IPostsRepository, useClass: PostsRepository },
    PostRedisDatabase,
  ],
  exports: [IPostsRepository, PostRedisDatabase],
})
export class PostsDatabaseModule {}
