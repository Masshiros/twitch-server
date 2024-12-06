type IsFollowQueryParams = {
  destinationFollowId: string
  sourceFollowId: string
}
export class IsFollowQuery {
  destinationFollowId: string
  sourceFollowId: string
  constructor(params: IsFollowQueryParams) {
    ;(this.destinationFollowId = params.destinationFollowId),
      (this.sourceFollowId = params.sourceFollowId)
  }
}
