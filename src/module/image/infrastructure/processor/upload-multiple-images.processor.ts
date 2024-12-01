import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq"
import { Logger } from "@nestjs/common"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { Job } from "bullmq"
import { Bull } from "libs/constants/bull"
import { Events } from "libs/constants/events"
import {
  InfrastructureError,
  InfrastructureErrorCode,
  InfrastructureErrorDetailCode,
} from "libs/exception/infrastructure"
import { PrismaService } from "prisma/prisma.service"
import sharp from "sharp"
import { CloudinaryService } from "src/integration/file/cloudinary/cloudinary.service"
import { ImagesUploadedEvent } from "../../domain/event/images-uploaded.event"
import { ImageFactory } from "../../domain/factory/image.factory"
import { IImageRepository } from "../../domain/repository/image.interface.repository"

@Processor(Bull.queue.image.upload_multiple)
export class UploadMultipleImagesProcessor extends WorkerHost {
  private logger = new Logger(UploadMultipleImagesProcessor.name)

  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly imageRepository: IImageRepository,

    private readonly eventEmitter: EventEmitter2,
  ) {
    super()
  }

  @OnWorkerEvent("active")
  onQueueActive(job: Job) {
    this.logger.log(`Job has been started: ${job.id}`)
  }

  @OnWorkerEvent("completed")
  onQueueComplete(job: Job, result: string[]) {
    this.logger.log(`Job has been finished: ${job.id}`)

    const { applicableId } = job.data

    this.eventEmitter.emit(
      Events.image.multiple_upload,
      new ImagesUploadedEvent(result, applicableId),
    )
    this.logger.log(
      `Image URLs emitted successfully for postId: ${applicableId} with ${result}`,
    )
  }

  @OnWorkerEvent("failed")
  onQueueFailed(job: Job, error: any) {
    this.logger.log(`Job has been failed: ${job.id}`)
    throw new Error(`Image upload failed: ${error.message}`)
  }

  async process(job: Job): Promise<string[]> {
    const { files, folder, applicableId, applicableType, imageType } = job.data
    let uploadedImages = []

    try {
      await Promise.all(
        files.map(async (file) => {
          await sharp(Buffer.from(file.buffer))
            .resize({ width: 1024, height: 1024 })
            .webp({ quality: 80 })
            .toBuffer()
          const result = await this.cloudinaryService.uploadImage(
            file,
            imageType
              ? `${folder}/${imageType}/${applicableId}`
              : `${folder}/${applicableId}`,
          )

          if (!result) {
            throw new InfrastructureError({
              code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
              message: "Error while uploading image to server",
              info: {
                errorCode: InfrastructureErrorDetailCode.UPLOAD_IMAGE_FAIL,
              },
            })
          }

          const image = ImageFactory.createImage({
            url: result.secure_url,
            publicId: result.public_id,
            applicableId,
            applicableType,
            imageType,
          })

          await this.imageRepository.save(image)

          uploadedImages.push(result.secure_url)
        }),
      )

      return uploadedImages
    } catch (error) {
      this.logger.error(`Error processing image uploads: ${error.message}`)
      throw error
    }
  }
}
