type DeleteMessageCommandParams = {
  userId: string
  messageId: string
}
export class DeleteMessageCommand {
  messageId: string
  userId: string
  constructor(params: DeleteMessageCommandParams) {
    this.messageId = params.messageId
    this.userId = params.userId
  }
}
