import { IEvent } from "@nestjs/cqrs"
import { Message } from "../../entity/message.entity"

export class MessageDeleteEvent implements IEvent {
  constructor(public readonly message: Message) {}
}
