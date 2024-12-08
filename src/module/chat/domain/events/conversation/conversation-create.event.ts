import { IEvent } from "@nestjs/cqrs"
import { Conversation } from "../../entity/conversation.entity"

export class ConversationCreateEvent implements IEvent {
  constructor(private readonly conversation: Conversation) {}
}
