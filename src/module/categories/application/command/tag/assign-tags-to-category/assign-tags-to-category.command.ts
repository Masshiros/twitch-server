type AssignTagsToCategoryParams = {
  categoryId: string
  tagsId: string[]
}
export class AssignTagsToCategoryCommand {
  categoryId: string
  tagsId: string[]
  constructor(params: AssignTagsToCategoryParams) {
    this.categoryId = params.categoryId
    this.tagsId = params.tagsId
  }
}
