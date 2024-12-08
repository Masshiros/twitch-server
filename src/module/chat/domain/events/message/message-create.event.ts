import { IEvent } from "@nestjs/cqrs"
import { Message } from "../../entity/message.entity"

export class MessageCreateEvent implements IEvent {
  constructor(private readonly message: Message) {}
}
