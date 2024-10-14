type UpdateTagCommandParams = {
  tagId: string
  name: string
}
export class UpdateTagCommand {
  tagId: string
  name: string
  constructor(params: UpdateTagCommandParams) {
    this.tagId = params.tagId
    this.name = params.name
  }
}
