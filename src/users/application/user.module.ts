import { Module } from "@nestjs/common"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { JwtModule } from "@nestjs/jwt"
import { DatabaseModule } from "../../../prisma/database.module"
import { UserFactory } from "../domain/factory/user/index"
import { AuthController } from "../presentation/auth.controller"
import { UserProfile } from "../presentation/http/profile/user.profile"
import { UserController } from "../presentation/user.controller"
import { AuthService } from "./auth.service"
import { SignInCommandHandler } from "./command/auth/signin/signin.handler"
import { SignupWithEmailCommandHandler } from "./command/auth/signup-with-email/signup-with-email.handler"
import { SignupWithPhoneCommandHandler } from "./command/auth/signup-with-phone/signup-with-phone.handler"
import { DeleteUserCommandHandler } from "./command/user/delete-user/delete-user.handler"
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
]
const queryHandlers = [GetUserQueryHandler, GetAllUsersQueryHandler]
@Module({
  controllers: [AuthController, UserController],
  providers: [
    UserFactory,
    UserProfile,
    AuthService,
    UserService,
    CommandBus,
    QueryBus,
    ...commandHandlers,
    ...queryHandlers,
  ],
  imports: [
    DatabaseModule,
    JwtModule.register({
      global: true,
      // TODO: config module later
      secret: "secret",
      signOptions: { expiresIn: "60s" },
    }),
  ],
})
export class UserModule {}
