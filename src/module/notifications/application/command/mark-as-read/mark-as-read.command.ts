type MarkAsReadCommandParams = {
  notificationId: string
  userId: string
}
export class MarkAsReadCommand {
  notificationId: string
  userId: string
  constructor(params: MarkAsReadCommandParams) {
    this.notificationId = params.notificationId
    this.userId = params.userId
  }
}
