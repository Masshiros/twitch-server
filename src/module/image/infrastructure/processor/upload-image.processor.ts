import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq"
import { Logger } from "@nestjs/common"
import { Job } from "bullmq"
import { Bull } from "libs/constants/bull"
import {
  InfrastructureError,
  InfrastructureErrorCode,
  InfrastructureErrorDetailCode,
} from "libs/exception/infrastructure"
import { PrismaService } from "prisma/prisma.service"
import { CloudinaryService } from "src/integration/file/cloudinary/cloudinary.service"
import { ImageFactory } from "../../domain/factory/image.factory"
import { IImageRepository } from "../../domain/repository/image.interface.repository"

@Processor(Bull.queue.image.upload)
export class ImageUploadProcessor extends WorkerHost {
  private logger = new Logger(ImageUploadProcessor.name)
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly imageRepository: IImageRepository,
    private readonly prismaService: PrismaService,
  ) {
    super()
  }
  @OnWorkerEvent("active")
  onQueueActive(job: Job) {
    this.logger.log(`Job has been started: ${job.id}`)
  }

  @OnWorkerEvent("completed")
  onQueueComplete(job: Job, result: any) {
    this.logger.log(`Job has been finished: ${job.id}`)
  }

  @OnWorkerEvent("failed")
  onQueueFailed(job: Job, error: any) {
    this.logger.log(`Job has been failed: ${job.id}`)
    if (error instanceof InfrastructureError) {
      throw error
    }

    throw new InfrastructureError({
      code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
      message: error.message,
    })
  }

  async process(job: Job, token?: string): Promise<any> {
    let result
    try {
      const { file, folder, applicableId, applicableType, imageType } = job.data
      result = await this.cloudinaryService.uploadImage(
        file,
        imageType
          ? `${folder}/${imageType}/${applicableId}`
          : `${folder}/${applicableId}`,
      )
      console.log(result)
      if (!result || result === null) {
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
      // Save the image in the repository
      await this.imageRepository.save(image)
    } catch (error) {
      await this.cloudinaryService.deleteImage(result.public_id)
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
}
