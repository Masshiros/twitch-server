import { Injectable } from "@nestjs/common"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { ConfirmEmailCommand } from "./command/auth/confirm-email/confirm-email.command"
import { RefreshTokenCommand } from "./command/auth/refresh-token/refresh-token.command"
import { SignInCommand } from "./command/auth/signin/signin.command"
import { SignupWithEmailCommand } from "./command/auth/signup-with-email/signup-with-email.command"
import { SignupWithPhoneCommand } from "./command/auth/signup-with-phone/signup-with-phone.command"
import { ToggleTwoFaCommand } from "./command/auth/toggle-two-fa/toggle-two-fa.command"

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
  refreshToken(refreshTokenCommand: RefreshTokenCommand) {
    return this.commandBus.execute(refreshTokenCommand)
  }
  confirmEmail(confirmEmailCommand: ConfirmEmailCommand) {
    return this.commandBus.execute(confirmEmailCommand)
  }
  toggle2FA(toggleTwoFAcommand: ToggleTwoFaCommand) {
    return this.commandBus.execute(toggleTwoFAcommand)
  }
}
