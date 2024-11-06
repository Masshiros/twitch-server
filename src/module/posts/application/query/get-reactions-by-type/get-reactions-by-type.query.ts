import { EReactionType } from "libs/constants/enum"

type GetReactionsByTypeQueryParams = {
  postId: string
  reactionType: EReactionType
}
export class GetReactionsByTypeQuery {
  postId: string
  reactionType: EReactionType
  constructor(params: GetReactionsByTypeQuery) {
    this.postId = params.postId
    this.reactionType = params.reactionType
  }
}
