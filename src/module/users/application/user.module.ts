import { Module } from "@nestjs/common"
import { CommandBus, CqrsModule, QueryBus } from "@nestjs/cqrs"
import { JwtModule } from "@nestjs/jwt"
import { PrismaService } from "prisma/prisma.service"
import { NodeMailerModule } from "src/integration/email/nodemailer/nodemailer.module"
import { PostmarkModule } from "src/integration/email/postmark/postmark.module"
import { TwilioModule } from "src/integration/twilio/twilio.module"
import { DatabaseModule } from "../../../../prisma/database.module"
import { UserFactory } from "../domain/factory/user/index"
import { UserDatabaseModule } from "../infrastructure/database/user.database.module"
import { AuthController } from "../presentation/auth.controller"
import { UserController } from "../presentation/user.controller"
import { AuthService } from "./auth.service"
import { ConfirmEmailCommandHandler } from "./command/auth/confirm-email/confirm-email.handler"
import { ForgotPasswordCommandHandler } from "./command/auth/forgot-password/forgot-password.handler"
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
]
const queryHandlers = [GetUserQueryHandler, GetAllUsersQueryHandler]
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
