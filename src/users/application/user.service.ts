import { Injectable } from "@nestjs/common"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { DeleteUserCommand } from "./command/user/delete-user/delete-user.command"
import { UpdateBioCommand } from "./command/user/update-bio/update-bio.command"
import { UpdateUsernameCommand } from "./command/user/update-username/update-username.command"
import { GetUserQuery } from "./query/user/get-user/get-user.query"

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
  updateUsername(updateUsernameCommand: UpdateUsernameCommand) {
    return this.commandBus.execute(updateUsernameCommand)
  }
  getUser(getUserQuery: GetUserQuery) {
    return this.queryBus.execute(getUserQuery)
  }
}
