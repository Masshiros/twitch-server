type SetStreamInfoCommandParams = {
  userId: string
  title: string
  categoryId?: string
}
export class SetStreamInfoCommand {
  userId: string
  title: string
  categoryId?: string

  constructor(params: SetStreamInfoCommandParams) {
    this.userId = params.userId

    this.title = params.title
    this.categoryId = params.categoryId
  }
}
