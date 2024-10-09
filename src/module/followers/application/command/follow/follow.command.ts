type FollowCommandParams = {
  sourceUserId: string
  destinationUserId: string
}
export class FollowCommand {
  sourceUserId: string
  destinationUserId: string
  constructor(params: FollowCommandParams) {
    this.sourceUserId = params.sourceUserId
    this.destinationUserId = params.destinationUserId
  }
}
