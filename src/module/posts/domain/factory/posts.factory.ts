import { randomUUID } from "crypto"
import { EReactionType } from "libs/constants/enum"
import { Comment } from "../entity/comments.entity"
import { PostReactions } from "../entity/post-reactions.entity"
import { Post } from "../entity/posts.entity"
import { EUserPostVisibility } from "../enum/posts.enum"

interface PostCreationProps {
  userId: string
  content: string
  visibility?: EUserPostVisibility
  totalViewCount?: number
  postReactions?: PostReactions[]
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
export class PostFactory {
  static createPost(props: PostCreationProps): Post {
    return new Post({
      userId: props.userId,
      // groupId: props.groupId,
      content: props.content,
      visibility: props.visibility ?? EUserPostVisibility.PUBLIC,
      totalViewCount: props.totalViewCount ?? 0,
      postReactions: props.postReactions ?? [],
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
}
