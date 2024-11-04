import { randomUUID } from "crypto"
import { Image } from "../entity/image.entity"
import { EImage } from "../enum/image.enum"

interface ImageCreationProps {
  url: string // Cloudinary URL
  publicId: string // Cloudinary public_id for deletion
  applicableId: string
  applicableType: EImage
}

export class ImageFactory {
  static createImage(props: ImageCreationProps): Image {
    return new Image({
      id: randomUUID(),
      url: props.url,
      publicId: props.publicId,
      applicableId: props.applicableId,
      applicableType: props.applicableType,
      createdAt: new Date(),
    })
  }
}
