import { IEvent } from "@nestjs/cqrs"
import { Post } from "src/module/posts/domain/entity/posts.entity"

export class PostUpdateEvent implements IEvent {
  constructor(public readonly post: Post) {}
}
