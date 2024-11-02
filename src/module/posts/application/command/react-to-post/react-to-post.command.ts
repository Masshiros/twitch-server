import { EReactionType } from "libs/constants/enum"

type ReactToPostCommandParams = {
  userId: string
  postId: string
  reactionType: EReactionType
}

export class ReactToPostCommand {
  userId: string
  postId: string
  reactionType: EReactionType
  constructor(params: ReactToPostCommandParams) {
    this.userId = params.userId
    this.postId = params.postId
    this.reactionType = params.reactionType
  }
}
