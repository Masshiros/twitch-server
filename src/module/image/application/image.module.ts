import { BullModule } from "@nestjs/bullmq"
import { Module } from "@nestjs/common"
import { Bull } from "libs/constants/bull"
import { CloudinaryModule } from "src/integration/file/cloudinary/cloudinary.module"
import { ImageDatabaseModule } from "../infrastructure/database/image.database.module"
import { ImageProcessorModule } from "../infrastructure/processor/image.processor.module"
import { ImageService } from "./image.service"

@Module({
  imports: [
    ImageDatabaseModule,
    BullModule.registerFlowProducer({
      name: Bull.flow.image,
      prefix: "TWITCH",
    }),
    BullModule.registerQueue({
      name: Bull.queue.image.upload,
      prefix: "TWITCH",
    }),
    BullModule.registerQueue({
      name: Bull.queue.image.optimize,
      prefix: "TWITCH",
    }),
    BullModule.registerQueue({
      name: Bull.queue.image.remove,
      prefix: "TWITCH",
    }),
    BullModule.registerQueue({
      name: Bull.queue.image.upload_multiple,
      prefix: "TWITCH",
    }),
    ImageProcessorModule,
  ],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
