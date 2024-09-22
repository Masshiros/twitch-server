import { Injectable } from "@nestjs/common"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { DeleteUserCommand } from "./command/user/delete-user/delete-user.command"
import { UpdateBioCommand } from "./command/user/update-bio/update-bio.command"

@Injectable()
export class UserService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  delete(deleteUserCommand: DeleteUserCommand) {
    return this.commandBus.execute(deleteUserCommand)
  }
  updateBio(updateBioCommand: UpdateBioCommand) {
    return this.commandBus.execute(updateBioCommand)
  }
}
