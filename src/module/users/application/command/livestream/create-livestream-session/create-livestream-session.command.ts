type CreateLivestreamSessionCommandParams = {
  ingressId: string
  userId: string
  startStreamAt: Date
  totalView: number
  isLive: boolean
}
export class CreateLivestreamSessionCommand {
  ingressId: string
  userId: string
  startStreamAt: Date
  totalView: number
  isLive: boolean
  constructor(params: CreateLivestreamSessionCommandParams) {
    this.ingressId = params.ingressId
    this.userId = params.userId
    this.startStreamAt = params.startStreamAt
    this.totalView = params.totalView
    this.isLive = params.isLive
  }
}
