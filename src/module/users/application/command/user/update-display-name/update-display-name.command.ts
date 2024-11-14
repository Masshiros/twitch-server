type UpdateDisplayNameCommandParams = {
  id?: string
  displayName?: string
}
export class UpdateDisplayNameCommand {
  id: string
  displayName: string
  constructor(params: UpdateDisplayNameCommandParams) {
    this.id = params.id
    this.displayName = params.displayName
  }
}
