import { ECategory } from "src/module/categories/domain/enum/categories.enum"

type CreateCategoryCommandParams = {
  name: string
  image: Express.Multer.File
  applicableTo: ECategory
}
export class CreateCategoryCommand {
  name: string
  image: Express.Multer.File
  applicableTo: ECategory
  constructor(params: CreateCategoryCommandParams) {
    this.name = params.name
    this.image = params.image
    this.applicableTo = params.applicableTo
  }
}
