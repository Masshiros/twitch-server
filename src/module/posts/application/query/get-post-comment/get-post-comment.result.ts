import { UserResult } from "../common/user.result"

export class postCommentResult {
  id: string
  user: UserResult
  content: string
  created: Date
  replies: postCommentResult[]
}
export class getPostCommentResult {
  comments: postCommentResult[]
}
