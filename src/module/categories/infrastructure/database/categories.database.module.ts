import { Module } from "@nestjs/common"
import { DatabaseModule } from "prisma/database.module"
import { ICategoriesRepository } from "../../domain/repository/categories.interface.repository"
import { CategoriesRepository } from "./prisma/repositories/categories.repository"

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: ICategoriesRepository,
      useClass: CategoriesRepository,
    },
  ],
  exports: [ICategoriesRepository],
})
export class CategoriesDatabaseModule {}
