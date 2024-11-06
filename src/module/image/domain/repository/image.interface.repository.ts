import { Image } from "../entity/image.entity"

export abstract class IImageRepository {
  save: (image: Image) => Promise<void>
  delete: (image: Image) => Promise<void>
  getImageById: (imageId: string) => Promise<Image>
  getImageByType: (typeId: string) => Promise<Image[] | null>
}
