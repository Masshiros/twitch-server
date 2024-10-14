type UpdateCategoryCommandParams = {
  categoryId: string
  name: string
  image: string
}
export class UpdateCategoryCommand {
  categoryId: string
  name: string
  image: string
  constructor(params: UpdateCategoryCommandParams) {
    this.categoryId = params.categoryId
    this.name = params.name
    this.image = params.image
  }
}
