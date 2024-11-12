type AddDescriptionCommandParams = {
  groupId: string
  description: string
  userId: string
}
export class AddDescriptionCommand {
  groupId: string
  description: string
  userId: string
  constructor(params: AddDescriptionCommandParams) {
    this.groupId = params.groupId
    this.description = params.description
    this.userId = params.userId
  }
}
