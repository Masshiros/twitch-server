import { IEvent } from "@nestjs/cqrs"
import { Post } from "src/module/posts/domain/entity/posts.entity"

export class PostCreateEvent implements IEvent {
  constructor(
    public readonly post: Post,
    public readonly userId: string,
  ) {}
}
