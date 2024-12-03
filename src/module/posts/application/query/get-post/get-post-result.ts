import { PostResult } from "../common/post.result"
import { UserResult } from "../common/user.result"

export class GetPostResult {
  post: {
    user: UserResult
    info: PostResult
  }
}
