type UnfollowCommandParams = {
  sourceUserId: string
  destinationUserId: string
}
export class UnfollowCommand {
  sourceUserId: string
  destinationUserId: string
  constructor(params: UnfollowCommandParams) {
    this.sourceUserId = params.sourceUserId
    this.destinationUserId = params.destinationUserId
  }
}
