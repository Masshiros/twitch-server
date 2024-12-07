import { EReactionType } from "libs/constants/enum"
import { PostResult } from "../common/post.result"
import { UserResult } from "../common/user.result"

export class GetUserPostsResult {
  posts: {
    user: UserResult
    info: PostResult & { currentReaction: EReactionType | null }
  }[]
  pageTotalPosts: number
  totalPosts: number
  totalPage: number
}
