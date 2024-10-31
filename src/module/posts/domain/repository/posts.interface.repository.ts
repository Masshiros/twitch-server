import { EReactionType } from "libs/constants/enum"
import { UserAggregate } from "src/module/users/domain/aggregate"
import { PostReactions } from "../entity/post-reactions.entity"
import { Post } from "../entity/posts.entity"
import { EUserPostVisibility } from "../enum/posts.enum"

export abstract class IPostsRepository {
  createPost: (post: Post) => Promise<void>
  findPostById: (postId: string) => Promise<Post | null>
  updatePost: (postId: string, postData: Partial<Post>) => Promise<Post>
  deletePost: (postId: string) => Promise<void>
  // user feed
  getUserFeed: (userId: string) => Promise<Post[]>
  getPostsByVisibility: (
    userId: string,
    visibility: EUserPostVisibility,
  ) => Promise<Post[]>
  // hide post
  hidePostsFromUser: (userId: string, hiddenUserId: string) => Promise<void>
  unhidePostsFromUser: (userId: string, hiddenUserId: string) => Promise<void>
  isPostHiddenFromUser: (userId: string, postId: string) => Promise<boolean>
  // reaction
  addReactionToPost: (
    post: Post,
    user: UserAggregate,
    reaction: PostReactions,
  ) => Promise<void>
  removeReactionFromPost: (post: Post, user: UserAggregate) => Promise<void>
  getPostReactions: (post: Post) => Promise<PostReactions[]>
}
