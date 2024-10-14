type DeleteCategoryCommandParams = {
  categoryId: string
}
export class DeleteCategoryCommand {
  categoryId: string
  constructor(param: DeleteCategoryCommandParams) {
    this.categoryId = param.categoryId
  }
}
