import { EReactionType } from "libs/constants/enum"
import { UserAggregate } from "src/module/users/domain/aggregate"
import { Comment } from "../entity/comments.entity"
import { PostReactions } from "../entity/post-reactions.entity"
import { Post } from "../entity/posts.entity"
import { EUserPostVisibility } from "../enum/posts.enum"
import { ESharedType } from "../enum/shared-type.enum"

export abstract class IPostsRepository {
  createPost: (post: Post, taggedUserIds?: string[] | null) => Promise<void>
  findPostById: (postId: string) => Promise<Post | null>
  updatePost: (data: Post, taggedUserIds?: string[] | null) => Promise<void>
  deletePost: (post: Post) => Promise<void>
  searchPostsByKeyword: (keyword: string) => Promise<Post[]>
  // user
  getUserPost: (
    userId: string,
    {
      limit,
      offset,
      orderBy,
      order,
    }: {
      limit?: number
      offset?: number
      orderBy?: string
      order?: "asc" | "desc"
    },
  ) => Promise<Post[]>
  getPostOfUsers: (
    userIds: string[],
    {
      limit,
      offset,
      orderBy,
      order,
    }: {
      limit?: number
      offset?: number
      orderBy?: string
      order?: "asc" | "desc"
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
  getHiddenUserIds: (user: UserAggregate) => Promise<string[]>
  // reaction
  addOrUpdateReactionToPost: (reaction: PostReactions) => Promise<void>
  removeReactionFromPost: (reaction: PostReactions) => Promise<void>
  getPostReactions: (post: Post) => Promise<PostReactions[]>
  // tag user
  addTagUser: (user: UserAggregate, post: Post) => Promise<void>
  addTagUsers: (users: UserAggregate[], post: Post) => Promise<void>
  removeTagUser: (user: UserAggregate, post: Post) => Promise<void>
  removeAllTagUser: (post: Post) => Promise<void>
  getAllTagUserId: (post: Post) => Promise<string[] | null>
  getAllTagPost: (user: UserAggregate) => Promise<Post[] | null>
  // user view permission
  addUserView: (user: UserAggregate, post: Post) => Promise<void>
  addUserViews: (user: UserAggregate[], post: Post) => Promise<void>
  removeUserView: (user: UserAggregate, post: Post) => Promise<void>
  removeUserViews: (user: UserAggregate[], post: Post) => Promise<void>
  removePostUserViews: (post: Post) => Promise<void>
  hasUserViewPermission: (
    post: Post,
    currentUser: UserAggregate,
  ) => Promise<boolean>
  // share
  isSharedPost: (post: Post, user: UserAggregate) => Promise<boolean>
  getUserSharedPost: (sharedFromUser: UserAggregate) => Promise<Post[] | null>
  sharePost: (
    post: Post,
    shareBy: UserAggregate,
    shareTo: UserAggregate,
    shareToType: ESharedType,
    customContent: string,
  ) => Promise<void>
  // comment
  createComment: (comment: Comment) => Promise<void>
  getCommentByPost: (post: Post) => Promise<Comment[]>
  updateComment: (comment: Comment) => Promise<void>
  deleteComment: (comment: Comment) => Promise<void>
}
