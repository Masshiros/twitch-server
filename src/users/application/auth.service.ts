import { Injectable } from "@nestjs/common"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { SignInCommand } from "./command/auth/signin/signin.command"
import { SignupWithEmailCommand } from "./command/auth/signup-with-email/signup-with-email.command"
import { SignupWithPhoneCommand } from "./command/auth/signup-with-phone/signup-with-phone.command"

@Injectable()
export class AuthService {
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
  signin(signinCommand: SignInCommand) {
    return this.commandBus.execute(signinCommand)
  }
}
