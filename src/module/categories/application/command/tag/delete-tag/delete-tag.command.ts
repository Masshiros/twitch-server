type DeleteTagCommandParams = {
  tagId: string
}
export class DeleteTagCommand {
  tagId: string
  constructor(params: DeleteTagCommandParams) {
    this.tagId = params.tagId
  }
}
