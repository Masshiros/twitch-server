import { Injectable } from "@nestjs/common"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { CreateGroupCommand } from "./command/create-group/create-group.command"

@Injectable()
export class GroupsService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  async createGroup(command: CreateGroupCommand) {
    return this.commandBus.execute(command)
  }
}
