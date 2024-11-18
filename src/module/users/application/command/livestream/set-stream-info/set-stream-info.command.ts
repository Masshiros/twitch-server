type SetStreamInfoCommandParams = {
  userId: string

  title: string
  categoryIds?: string[]
  tagsIds?: string[]
}
export class SetStreamInfoCommand {
  userId: string
  title: string
  categoryIds?: string[]
  tagsIds?: string[]
  constructor(params: SetStreamInfoCommandParams) {
    this.userId = params.userId

    this.title = params.title
    this.categoryIds = params.categoryIds ?? []
    this.tagsIds = params.tagsIds ?? []
  }
}
