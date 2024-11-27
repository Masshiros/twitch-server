type UpdateLivestreamSessionCommandParams = {
  userId: string
  endStreamAt: Date
  totalView: number
  isLive: boolean
}
export class UpdateLivestreamSessionCommand {
  userId: string
  endStreamAt: Date
  totalView: number
  isLive: boolean
  constructor(params: UpdateLivestreamSessionCommandParams) {
    this.userId = params.userId
    this.endStreamAt = params.endStreamAt
    this.totalView = params.totalView
    this.isLive = params.isLive
  }
}
