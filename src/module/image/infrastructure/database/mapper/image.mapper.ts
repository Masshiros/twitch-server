import {
  EImage as PrismaApplicableType,
  EImageType as PrismaImageType,
  type Image as PrismaImage,
} from "@prisma/client"
import { Image } from "src/module/image/domain/entity/image.entity"
import { EImageType as DomainImageType } from "src/module/image/domain/enum/image-type.enum"
import { EImage as DomainApplicableType } from "src/module/image/domain/enum/image.enum"

export class ImageMapper {
  // Convert Prisma Image entity to Domain Image entity
  static toDomain(prismaImage: PrismaImage): Image {
    return new Image({
      id: prismaImage.id,
      url: prismaImage.url,
      publicId: prismaImage.publicId,
      applicableId: prismaImage.applicableId,
      applicableType: this.mapPrismaToDomainEnum(prismaImage.applicableType),
      imageType: prismaImage.imageType
        ? this.mapPrismaToDomainImageType(prismaImage.imageType)
        : undefined,
      createdAt: prismaImage.createdAt,
      updatedAt: prismaImage.updatedAt,
      deletedAt: prismaImage.deletedAt,
    })
  }

  // Convert Domain Image entity to Prisma persistence format
  static toPersistence(domainImage: Image): PrismaImage {
    return {
      id: domainImage.id,
      url: domainImage.url,
      publicId: domainImage.publicId,
      applicableId: domainImage.applicableId,
      applicableType: this.mapDomainToPrismaEnum(domainImage.applicableType),
      imageType: domainImage.imageType
        ? this.mapDomainToPrismaImageType(domainImage.imageType)
        : null,
      createdAt: domainImage.createdAt,
      updatedAt: domainImage.updatedAt,
      deletedAt: domainImage.deletedAt,
    }
  }

  // Map Prisma applicableType enum to Domain applicableType enum
  static mapPrismaToDomainEnum(
    prismaEnum: PrismaApplicableType,
  ): DomainApplicableType {
    switch (prismaEnum) {
      case "USER":
        return DomainApplicableType.USER
      case "POST":
        return DomainApplicableType.POST
      case "CATEGORY":
        return DomainApplicableType.CATEGORY
      case "GROUP":
        return DomainApplicableType.GROUP
      default:
        throw new Error(`Unknown Prisma Enum value: ${prismaEnum}`)
    }
  }

  // Map Domain applicableType enum to Prisma applicableType enum
  static mapDomainToPrismaEnum(
    domainEnum: DomainApplicableType,
  ): PrismaApplicableType {
    switch (domainEnum) {
      case DomainApplicableType.USER:
        return "USER"
      case DomainApplicableType.POST:
        return "POST"
      case DomainApplicableType.CATEGORY:
        return "CATEGORY"
      case DomainApplicableType.GROUP:
        return "GROUP"
      default:
        throw new Error(`Unknown Domain Enum value: ${domainEnum}`)
    }
  }
  // Map Prisma imageType enum to Domain imageType enum
  static mapPrismaToDomainImageType(
    prismaEnum: PrismaImageType,
  ): DomainImageType {
    switch (prismaEnum) {
      case "THUMBNAIL":
        return DomainImageType.THUMBNAIL
      case "AVATAR":
        return DomainImageType.AVATAR
      default:
        throw new Error(`Unknown Prisma Enum value: ${prismaEnum}`)
    }
  }

  // Map Domain imageType enum to Prisma imageType enum
  static mapDomainToPrismaImageType(
    domainEnum: DomainImageType,
  ): PrismaImageType {
    switch (domainEnum) {
      case DomainImageType.THUMBNAIL:
        return "THUMBNAIL"
      case DomainImageType.AVATAR:
        return "AVATAR"
      default:
        throw new Error(`Unknown Domain Enum value: ${domainEnum}`)
    }
  }
}
