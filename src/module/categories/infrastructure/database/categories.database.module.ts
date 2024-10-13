import { Module } from "@nestjs/common"
import { DatabaseModule } from "prisma/database.module"
import { redisModule } from "src/integration/cache/redis/module.config"
import { ICategoriesRepository } from "../../domain/repository/categories.interface.repository"
import { CategoriesRepository } from "./prisma/repositories/categories.prisma.repository"
import { CategoriesRedisRepository } from "./redis/categories.redis.repository"

@Module({
  imports: [DatabaseModule, redisModule],
  providers: [
    {
      provide: ICategoriesRepository,
      useClass: CategoriesRepository,
    },
  ],
  exports: [ICategoriesRepository, CategoriesRedisRepository],
})
export class CategoriesDatabaseModule {}
