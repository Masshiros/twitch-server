import { EReactionType } from "libs/constants/enum"
import { UserAggregate } from "src/module/users/domain/aggregate"
import { PostReactions } from "../entity/post-reactions.entity"
import { Post } from "../entity/posts.entity"
import { EUserPostVisibility } from "../enum/posts.enum"

export abstract class IPostsRepository {
  createPost: (post: Post, taggedUserIds: string[]) => Promise<void>
  findPostById: (postId: string) => Promise<Post | null>
  updatePost: (data: Post) => Promise<void>
  deletePost: (post: Post) => Promise<void>
  // user feed
  getUserPost: (
    userId: string,
    {
      limit,
      offset,
      orderBy,
      order,
    }: {
      limit: number
      offset: number
      orderBy: string
      order: "asc" | "desc"
    },
  ) => Promise<Post[]>
  getPostsByVisibility: (
    userId: string,
    visibility: EUserPostVisibility,
  ) => Promise<Post[]>
  // hide post
  hidePostsFromUser: (userId: string, hiddenUserId: string) => Promise<void>
  unhidePostsFromUser: (userId: string, hiddenUserId: string) => Promise<void>
  isPostHiddenFromUser: (user: UserAggregate, post: Post) => Promise<boolean>
  // reaction
  addOrUpdateReactionToPost: (reaction: PostReactions) => Promise<void>
  removeReactionFromPost: (reaction: PostReactions) => Promise<void>
  getPostReactions: (post: Post) => Promise<PostReactions[]>
}
