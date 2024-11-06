import { Module } from "@nestjs/common"
import { DatabaseModule } from "prisma/database.module"
import { CloudinaryModule } from "src/integration/file/cloudinary/cloudinary.module"
import { ImageDatabaseModule } from "../database/image.database.module"
import { ImageOptimizationProcessor } from "./optimize-image.processor"
import { ImageRemoveProcessor } from "./remove-image.processor"
import { ImageUploadProcessor } from "./upload-image.processor"

@Module({
  imports: [ImageDatabaseModule, CloudinaryModule, DatabaseModule],
  providers: [
    ImageOptimizationProcessor,
    ImageUploadProcessor,
    ImageRemoveProcessor,
  ],
  exports: [
    ImageOptimizationProcessor,
    ImageUploadProcessor,
    ImageRemoveProcessor,
  ],
})
export class ImageProcessorModule {}
