import { EReactionType } from "libs/constants/enum"
import { UserAggregate } from "src/module/users/domain/aggregate"
import { PostReactions } from "../entity/post-reactions.entity"
import { Post } from "../entity/posts.entity"
import { EUserPostVisibility } from "../enum/posts.enum"

export abstract class IPostsRepository {
  createPost: (post: Post, taggedUserIds?: string[] | null) => Promise<void>
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
  isUserHidden: (
    user: UserAggregate,
    hiddenUser: UserAggregate,
  ) => Promise<boolean>
  hidePostsFromUser: (userId: string, hiddenUserId: string) => Promise<void>
  unhidePostsFromUser: (userId: string, hiddenUserId: string) => Promise<void>
  isPostHiddenFromUser: (user: UserAggregate, post: Post) => Promise<boolean>
  // reaction
  addOrUpdateReactionToPost: (reaction: PostReactions) => Promise<void>
  removeReactionFromPost: (reaction: PostReactions) => Promise<void>
  getPostReactions: (post: Post) => Promise<PostReactions[]>
  // tag user
  addTagUser: (user: UserAggregate, post: Post) => Promise<void>
  addTagUsers: (users: UserAggregate[], post: Post) => Promise<void>
  removeTagUser: (user: UserAggregate, post: Post) => Promise<void>
  removeAllTagUser: (post: Post) => Promise<void>
  // user view permission
  addUserView: (user: UserAggregate, post: Post) => Promise<void>
  addUserViews: (user: UserAggregate[], post: Post) => Promise<void>
  removeUserView: (user: UserAggregate, post: Post) => Promise<void>
  removeUserViews: (user: UserAggregate[], post: Post) => Promise<void>
}
