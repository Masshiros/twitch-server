type CreateMessageCommandParams = {
  userId: string
  conversationId: string
  content: string
}
export class CreateMessageCommand {
  userId: string
  conversationId: string
  content: string
  constructor(params: CreateMessageCommandParams) {
    this.userId = params.userId

    this.conversationId = params.conversationId
    this.content = params.content
  }
}
