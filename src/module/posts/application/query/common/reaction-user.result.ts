import { EReactionType } from "libs/constants/enum"

export interface ReactionUserResult {
  id: string
  username: string
  avatar: string
  reactionType: EReactionType
}
