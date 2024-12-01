import { randomUUID } from "crypto"
import { EReactionType } from "libs/constants/enum"
import { Comment } from "../entity/comments.entity"
import { PostReactions } from "../entity/post-reactions.entity"
import { Post } from "../entity/posts.entity"
import { ScheduledPost } from "../entity/scheduled-post.entity"
import { EUserPostVisibility } from "../enum/posts.enum"

interface PostCreationProps {
  id?: string
  userId: string
  content: string
  visibility?: EUserPostVisibility
  totalViewCount?: number
  postReactions?: PostReactions[]
  isPublic: boolean
  images?: string[]
}
interface PostReactionsCreationProps {
  groupPostId?: string
  userId: string
  postId?: string
  type: EReactionType
}
interface CommentCreationProps {
  postId: string
  userId: string
  parentId: string
  content: string
}
interface ScheduledPostCreationProps {
  userId: string
  postId: string
  scheduledAt: Date
  createdAt?: Date
}
export class PostFactory {
  static createPost(props: PostCreationProps): Post {
    return new Post({
      id: props.id,
      userId: props.userId,
      // groupId: props.groupId,
      postImages: props.images ?? [],
      content: props.content,
      visibility: props.visibility ?? EUserPostVisibility.PUBLIC,
      totalViewCount: props.totalViewCount ?? 0,
      postReactions: props.postReactions ?? [],
      isPublic: props.isPublic,
      createdAt: new Date(),
    })
  }
  static createCreation(props: PostReactionsCreationProps): PostReactions {
    return new PostReactions({
      groupPostId: props.groupPostId,
      userId: props.userId,
      postId: props.postId,
      type: props.type,
      createdAt: new Date(),
    })
  }
  static createComment(props: CommentCreationProps): Comment {
    return new Comment({
      userId: props.userId,
      postId: props.postId,
      parentId: props.parentId,
      content: props.content,
    })
  }
  static createSchedulePost(props: ScheduledPostCreationProps): ScheduledPost {
    return new ScheduledPost({
      userId: props.userId,
      postId: props.postId,
      scheduledAt: props.scheduledAt,
      createdAt: props.createdAt ?? new Date(),
    })
  }
}
