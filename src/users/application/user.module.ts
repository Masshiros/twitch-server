import { Module } from "@nestjs/common"
import { UserFactory } from "../domain/factory/user/index"
import { DatabaseModule } from "../infrastructure/database/database.module"
import { UserController } from "../presentation/user.controller"
import { SignupWithEmailCommandHandler } from "./command/user/signup-with-email/signup-with-email.handler"

@Module({
  controllers: [UserController],
  providers: [UserFactory, SignupWithEmailCommandHandler],
  imports: [DatabaseModule],
})
export class UserModule {}
