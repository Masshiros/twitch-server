type UpdateLivestreamSessionCommandParams = {
  ingressId: string
  userId: string
  streamAt: Date
  endStreamAt: Date
  totalView: number
  isLive: boolean
}
export class UpdateLivestreamSessionCommand {
  ingressId: string
  userId: string
  streamAt: Date
  endStreamAt: Date
  totalView: number
  isLive: boolean
  constructor(params: UpdateLivestreamSessionCommandParams) {
    this.ingressId = params.ingressId
    this.userId = params.userId
    this.streamAt = params.streamAt
    this.endStreamAt = params.endStreamAt
    this.totalView = params.totalView
    this.isLive = params.isLive
  }
}
