import { Injectable } from "@nestjs/common"
import { Prisma } from "@prisma/client"
import {
  InfrastructureError,
  InfrastructureErrorCode,
} from "libs/exception/infrastructure"
import { PrismaService } from "prisma/prisma.service"
import { EImage } from "src/module/image/domain/enum/image.enum"
import { IImageRepository } from "src/module/image/domain/repository/image.interface.repository"
import { handlePrismaError } from "utils/prisma-error"
import { Image } from "../../../domain/entity/image.entity"
import { ImageMapper } from "../mapper/image.mapper"

@Injectable()
export class ImageRepository implements IImageRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async save(image: Image): Promise<void> {
    try {
      const data = ImageMapper.toPersistence(image)

      const existImage = await this.prismaService.image.findUnique({
        where: { id: data.id },
      })
      if (existImage) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
          message: "Already exist this image",
        })
      }
      await this.prismaService.image.create({ data })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async delete(image: Image): Promise<void> {
    try {
      await this.prismaService.image.delete({
        where: { id: image.id },
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async getImageById(imageId: string): Promise<Image> {
    try {
      const image = await this.prismaService.image.findUnique({
        where: { id: imageId },
      })
      if (!image) {
        return null
      }
      return ImageMapper.toDomain(image) ?? null
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async getImageByType(typeId: string): Promise<Image[] | null> {
    try {
      const images = await this.prismaService.image.findMany({
        where: { applicableId: typeId },
      })
      if (!images) {
        return null
      }
      const result = images.map((i) => ImageMapper.toDomain(i))
      return result ?? null
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
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
