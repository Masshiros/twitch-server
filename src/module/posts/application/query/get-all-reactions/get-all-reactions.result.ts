import { EReactionType } from "libs/constants/enum"

interface ReactionUser {
  id: string
  username: string
  avatar: string
  reactionType: EReactionType
}

export class GetAllReactionsResult {
  reactionCount: number
  users: ReactionUser[]
}
