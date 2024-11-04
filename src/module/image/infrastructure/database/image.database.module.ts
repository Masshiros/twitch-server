import { Module } from "@nestjs/common"
import { DatabaseModule } from "prisma/database.module"
import { IImageRepository } from "../../domain/repository/image.interface.repository"
import { ImageRepository } from "./prisma/image.prisma.repository"

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: IImageRepository,
      useClass: ImageRepository,
    },
  ],
  exports: [IImageRepository],
})
export class ImageDatabaseModule {}
