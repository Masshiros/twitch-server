import { PostResult } from "../common/post.result"
import { UserResult } from "../common/user.result"

export class GetUserFeedResult {
  posts: {
    user: UserResult
    info: PostResult
  }[]
}
