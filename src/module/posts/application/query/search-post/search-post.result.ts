import { PostResult } from "../common/post.result"
import { UserResult } from "../common/user.result"

export class SearchPostResult {
  posts: {
    user: UserResult
    info: PostResult
  }[]
}
