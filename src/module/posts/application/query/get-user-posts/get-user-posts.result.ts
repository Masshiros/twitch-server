import { PostResult } from "../common/post.result"
import { UserResult } from "../common/user.result"

export class GetUserPostsResult {
  posts: {
    user: UserResult
    info: PostResult
  }[]
  pageTotalPosts: number
  totalPosts: number
  totalPage: number
}
