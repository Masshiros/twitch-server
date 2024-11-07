import { EReactionType } from "libs/constants/enum"
import { ReactionUserResult } from "../common/reaction-user.result"

export class GetAllReactionsResult {
  reactionCount: number
  users: ReactionUserResult[]
}
