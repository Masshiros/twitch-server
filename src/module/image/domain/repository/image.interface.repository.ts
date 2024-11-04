import { Image } from "../entity/image.entity"

export abstract class IImageRepository {
  save: (image: Image) => Promise<void>
  delete: (image: Image) => Promise<void>
  getImageByType: (typeId: string) => Promise<Image[] | null>
}
