import { IEvent } from "@nestjs/cqrs"
import { Comment } from "src/module/posts/domain/entity/comments.entity"

export class CommentCreateEvent implements IEvent {
  constructor(
    public readonly comment: Comment,
    public readonly parentId?: string,
  ) {}
}
