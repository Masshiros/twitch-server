import { randomUUID } from "crypto"
import { Image } from "../entity/image.entity"
import { EImageType } from "../enum/image-type.enum"
import { EImage } from "../enum/image.enum"

interface ImageCreationProps {
  url: string // Cloudinary URL
  publicId: string // Cloudinary public_id for deletion
  applicableId: string
  applicableType: EImage
  imageType?: EImageType
}

export class ImageFactory {
  static createImage(props: ImageCreationProps): Image {
    return new Image({
      id: randomUUID(),
      url: props.url,
      publicId: props.publicId,
      applicableId: props.applicableId,
      applicableType: props.applicableType,
      imageType: props.imageType,
      createdAt: new Date(),
    })
  }
}
