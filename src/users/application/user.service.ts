import { Injectable } from "@nestjs/common"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { DeleteUserCommand } from "./command/user/delete-user/delete-user.command"

@Injectable()
export class UserService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  delete(deleteUserCommand: DeleteUserCommand) {
    return this.commandBus.execute(deleteUserCommand)
  }
}
