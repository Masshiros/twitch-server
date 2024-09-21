import { Injectable } from "@nestjs/common"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { SignupWithEmailCommand } from "./command/user/signup-with-email/signup-with-email.command"
import { SignupWithPhoneCommand } from "./command/user/signup-with-phone/signup-with-phone.command"

@Injectable()
export class UserService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  signupWithEmail(signupWithEmailCommand: SignupWithEmailCommand) {
    return this.commandBus.execute(signupWithEmailCommand)
  }
  signupWithPhone(signupWithPhoneCommand: SignupWithPhoneCommand) {
    return this.commandBus.execute(signupWithPhoneCommand)
  }
}
