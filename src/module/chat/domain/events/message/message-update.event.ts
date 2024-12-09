import { IEvent } from "@nestjs/cqrs"
import { Message } from "../../entity/message.entity"

export class MessageUpdateEvent implements IEvent {
  constructor(public readonly message: Message) {}
}
