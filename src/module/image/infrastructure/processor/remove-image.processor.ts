import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq"
import { Logger } from "@nestjs/common"
import { Job } from "bullmq"
import { Bull } from "libs/constants/bull"
import { CommandErrorCode } from "libs/exception/application/command"
import {
  InfrastructureError,
  InfrastructureErrorCode,
} from "libs/exception/infrastructure"
import { CloudinaryService } from "src/integration/file/cloudinary/cloudinary.service"
import { Image } from "../../domain/entity/image.entity"
import { IImageRepository } from "../../domain/repository/image.interface.repository"

@Processor(Bull.queue.image.remove)
export class ImageRemoveProcessor extends WorkerHost {
  private logger = new Logger(ImageRemoveProcessor.name)
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly imageRepository: IImageRepository,
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
    this.logger.log(`Remove Image Job has been failed: ${job.id}`)
    if (error instanceof InfrastructureError) {
      throw error
    }

    throw new InfrastructureError({
      code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
      message: error.message,
    })
  }
  async process(job: Job): Promise<any> {
    try {
      const {
        imageData,
      }: { imageData: { publicId: string; [key: string]: any } } = job.data
      // console.log("IMAGE DATA", imageData.publicId)
      // console.log("IMAGE DATA", imageData.id)
      const result = await this.cloudinaryService.deleteImage(
        imageData.publicId,
      )
      if (result.result !== "ok") {
        throw new InfrastructureError({
          code: CommandErrorCode.INTERNAL_SERVER_ERROR,
          message: `Failed to delete image on Cloudinary for publicId: ${imageData.publicId}`,
        })
      }
      const image = await this.imageRepository.getImageById(imageData.id)
      // console.log("IMAGE DATA", image)
      await this.imageRepository.delete(image)
    } catch (error) {
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
