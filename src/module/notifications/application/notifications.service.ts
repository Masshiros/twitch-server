import { Injectable } from "@nestjs/common"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { MarkAsReadCommand } from "./command/mark-as-read/mark-as-read.command"

@Injectable()
export class NotificationsService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  async markAsRead(command: MarkAsReadCommand) {
    return await this.commandBus.execute(command)
  }
}
