import { Module } from "@nestjs/common"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { UserFactory } from "../domain/factory/user/index"
import { DatabaseModule } from "../infrastructure/database/database.module"
import { AuthController } from "../presentation/auth.controller"
import { UserProfile } from "../presentation/http/profile/user.profile"
import { UserController } from "../presentation/user.controller"
import { AuthService } from "./auth.service"
import { SignupWithEmailCommandHandler } from "./command/auth/signup-with-email/signup-with-email.handler"
import { SignupWithPhoneCommandHandler } from "./command/auth/signup-with-phone/signup-with-phone.handler"
import { DeleteUserCommandHandler } from "./command/user/delete-user/delete-user.handler"
import { UpdateBioCommandHandler } from "./command/user/update-bio/update-bio.handler"
import { UserService } from "./user.service"

@Module({
  controllers: [AuthController, UserController],
  providers: [
    UserFactory,
    UserProfile,
    SignupWithEmailCommandHandler,
    SignupWithPhoneCommandHandler,
    DeleteUserCommandHandler,
    UpdateBioCommandHandler,
    AuthService,
    UserService,
    CommandBus,
    QueryBus,
  ],
  imports: [DatabaseModule],
})
export class UserModule {}
