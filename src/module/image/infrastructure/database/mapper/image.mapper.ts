import {
  EImage as PrismaApplicableType,
  type Image as PrismaImage,
} from "@prisma/client"
import { Image } from "src/module/image/domain/entity/image.entity"
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
}
