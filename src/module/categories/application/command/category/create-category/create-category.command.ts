type CreateCategoryCommandParams = {
  name: string
  image: Express.Multer.File
}
export class CreateCategoryCommand {
  name: string
  image: Express.Multer.File

  constructor(params: CreateCategoryCommandParams) {
    this.name = params.name
    this.image = params.image
  }
}
