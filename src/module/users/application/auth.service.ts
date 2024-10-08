import { Injectable } from "@nestjs/common"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { ConfirmEmailCommand } from "./command/auth/confirm-email/confirm-email.command"
import { ForgotPasswordCommand } from "./command/auth/forgot-password/forgot-password.command"
import { LogoutFromAllDeviceCommand } from "./command/auth/logout-from-all-device/logout-from-all-device.command"
import { LogoutFromOneDeviceCommand } from "./command/auth/logout-from-one-device/logout-from-one-device.command"
import { RefreshTokenCommand } from "./command/auth/refresh-token/refresh-token.command"
import { ResendVerifyEmailCommand } from "./command/auth/resend-verify-email/resend-verify-email.command"
import { ResetPasswordCommand } from "./command/auth/reset-password/reset-password.command"
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
  resendVerifyEmail(command: ResendVerifyEmailCommand) {
    return this.commandBus.execute(command)
  }
  forgotPassword(command: ForgotPasswordCommand) {
    return this.commandBus.execute(command)
  }
  resetPassword(command: ResetPasswordCommand) {
    return this.commandBus.execute(command)
  }
  logoutFromAllDevice(command: LogoutFromAllDeviceCommand) {
    return this.commandBus.execute(command)
  }
  logoutFromOneDevice(command: LogoutFromOneDeviceCommand) {
    return this.commandBus.execute(command)
  }
}
