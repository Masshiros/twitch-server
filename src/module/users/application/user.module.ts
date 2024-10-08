import { Module } from "@nestjs/common"
import { CqrsModule } from "@nestjs/cqrs"
import { DatabaseModule } from "prisma/database.module"
import { NodeMailerModule } from "src/integration/email/nodemailer/nodemailer.module"
import { TwilioModule } from "src/integration/twilio/twilio.module"
import { UserFactory } from "../domain/factory/user/index"
import { UserDatabaseModule } from "../infrastructure/database/user.database.module"
import { AuthController } from "../presentation/auth.controller"
import { UserController } from "../presentation/user.controller"
import { AuthService } from "./auth.service"
import { ConfirmEmailCommandHandler } from "./command/auth/confirm-email/confirm-email.handler"
import { ForgotPasswordCommandHandler } from "./command/auth/forgot-password/forgot-password.handler"
import { LogoutFromAllDeviceCommandHandler } from "./command/auth/logout-from-all-device/logout-from-all-device.handler"
import { LogoutFromOneDeviceCommandHandler } from "./command/auth/logout-from-one-device/logout-from-one-device.handler"
import { ResendVerifyEmailCommandHandler } from "./command/auth/resend-verify-email/resend-verify-email.handler"
import { ResetPasswordCommandHandler } from "./command/auth/reset-password/reset-password.handler"
import { SignInCommandHandler } from "./command/auth/signin/signin.handler"
import { SignupWithEmailCommandHandler } from "./command/auth/signup-with-email/signup-with-email.handler"
import { SignupWithPhoneCommandHandler } from "./command/auth/signup-with-phone/signup-with-phone.handler"
import { ToggleTwoFaCommandHandler } from "./command/auth/toggle-two-fa/toggle-two-fa.handler"
import { DeleteUserCommandHandler } from "./command/user/delete-user/delete-user.handler"
import { ToggleActivateCommandHandler } from "./command/user/toggle-activate/toggle-activate.handler"
import { UpdateBioCommandHandler } from "./command/user/update-bio/update-bio.handler"
import { UpdateUsernameCommandHandler } from "./command/user/update-username/update-username.handler"
import { GetListDeviceQueryHandler } from "./query/device/get-list-device/get-list-device.handler"
import { GetListLoginHistoriesQueryHandler } from "./query/login-history/get-list-login-histories/get-list-login-histories.handler"
import { GetAllUsersQueryHandler } from "./query/user/get-all-user/get-all-user.handler"
import { GetUserQueryHandler } from "./query/user/get-user/get-user.handler"
import { UserService } from "./user.service"

const commandHandlers = [
  SignupWithEmailCommandHandler,
  SignupWithPhoneCommandHandler,
  DeleteUserCommandHandler,
  UpdateBioCommandHandler,
  UpdateUsernameCommandHandler,
  SignInCommandHandler,
  ToggleTwoFaCommandHandler,
  ConfirmEmailCommandHandler,
  ResendVerifyEmailCommandHandler,
  ForgotPasswordCommandHandler,
  ResetPasswordCommandHandler,
  ToggleActivateCommandHandler,
  LogoutFromAllDeviceCommandHandler,
  LogoutFromOneDeviceCommandHandler,
]
const queryHandlers = [
  GetUserQueryHandler,
  GetAllUsersQueryHandler,
  GetListDeviceQueryHandler,
  GetListLoginHistoriesQueryHandler,
]
@Module({
  controllers: [AuthController, UserController],
  providers: [
    UserFactory,
    AuthService,
    UserService,
    ...commandHandlers,
    ...queryHandlers,
  ],
  imports: [CqrsModule, UserDatabaseModule, NodeMailerModule, TwilioModule],
})
export class UserModule {}
