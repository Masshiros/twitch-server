import { UserResult } from "./user.result"

export interface ConversationsResult {
  id: string
  receiver: UserResult
  lastMessage: string
  lastMessageSentAt: Date
}
