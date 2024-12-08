import { IEvent } from "@nestjs/cqrs"
import { Message } from "../../entity/message.entity"

export class MessageCreateEvent implements IEvent {
  constructor(public readonly message: Message) {}
}
