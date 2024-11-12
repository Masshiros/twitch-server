import { Injectable } from "@nestjs/common"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { AddCoverImageCommand } from "./command/add-cover-image/add-cover-image.command"
import { AddDescriptionCommand } from "./command/add-description/add-description.command"
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
  async addCoverImage(command: AddCoverImageCommand) {
    return this.commandBus.execute(command)
  }
  async addDescription(command: AddDescriptionCommand) {
    return this.commandBus.execute(command)
  }
}
