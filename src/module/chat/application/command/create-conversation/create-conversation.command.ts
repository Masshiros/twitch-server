type CreateConversationCommandParams = {
  creatorId: string
  recipientId: string
}
export class CreateConversationCommand {
  creatorId: string
  recipientId: string
  constructor(params: CreateConversationCommandParams) {
    this.creatorId = params.creatorId
    this.recipientId = params.recipientId
  }
}
