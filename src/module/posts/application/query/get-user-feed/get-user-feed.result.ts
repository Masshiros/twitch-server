import { EReactionType } from "libs/constants/enum"
import { PostResult } from "../common/post.result"
import { UserResult } from "../common/user.result"
import { postCommentResult } from "../get-post-comment/get-post-comment.result"

export class GetUserFeedResult {
  posts: {
    user: UserResult
    info: PostResult & { currentReaction: EReactionType | null }
  }[]
}
