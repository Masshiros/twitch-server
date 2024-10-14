import { ECategory } from "src/module/categories/domain/enum/categories.enum"

type CreateCategoryCommandParams = {
  name: string
  image: string
  applicableTo: ECategory
}
export class CreateCategoryCommand {
  name: string
  image: string
  applicableTo: ECategory
  constructor(params: CreateCategoryCommandParams) {
    this.name = params.name
    this.image = params.image
    this.applicableTo = params.applicableTo
  }
}
