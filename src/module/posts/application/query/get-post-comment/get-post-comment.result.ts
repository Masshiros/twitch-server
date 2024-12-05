import { UserResult } from "../common/user.result"

export class postCommentResult {
  id: string
  user: UserResult
  content: string
  replies: postCommentResult[]
}
export class getPostCommentResult {
  comments: postCommentResult[]
}
