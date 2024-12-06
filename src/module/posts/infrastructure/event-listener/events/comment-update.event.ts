import { IEvent } from "@nestjs/cqrs"
import { Comment } from "src/module/posts/domain/entity/comments.entity"

export class CommentUpdateEvent implements IEvent {
  constructor(public readonly comment: Comment) {}
}
