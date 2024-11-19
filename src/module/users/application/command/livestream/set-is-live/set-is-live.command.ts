type SetIsLiveCommandParams = {
  userId: string
  isLive: boolean
}
export class SetIsLiveCommand {
  userId: string
  isLive: boolean
  constructor(params: SetIsLiveCommandParams) {
    this.userId = params.userId
    this.isLive = params.isLive
  }
}
