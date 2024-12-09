type UpdateMessageCommandParams = {
  userId: string
  messageId: string
  content: string
}
export class UpdateMessageCommand {
  userId: string
  messageId: string
  content: string
  constructor(params: UpdateMessageCommand) {
    this.userId = params.userId
    this.messageId = params.messageId
    this.content = params.content
  }
}
