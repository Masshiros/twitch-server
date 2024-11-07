import { EReactionType } from "libs/constants/enum"
import { ReactionUserResult } from "../common/reaction-user.result"

export class GetReactionsByTypeResult {
  type: EReactionType
  reactionCount: number
  users: ReactionUserResult[]
}
