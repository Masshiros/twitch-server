import { IEvent } from "@nestjs/cqrs"
import { Conversation } from "../../entity/conversation.entity"

export class ConversationListEvent implements IEvent {
  constructor(private readonly conversations: any) {}
}
