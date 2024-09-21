import { Body, Controller, Post } from "@nestjs/common"
import { SignupWithEmailCommand } from "../application/command/user/signup-with-email/signup-with-email.command"
import { SignupWithEmailCommandHandler } from "../application/command/user/signup-with-email/signup-with-email.handler"
import { SignupWithEmailDto } from "./http/dto/request/signup-with-email.dto"

@Controller("users")
export class UserController {
  constructor(
    private readonly signupWithEmailCommandHandler: SignupWithEmailCommandHandler,
  ) {}
  @Post("/signup-with-email")
  async signUpWithEmail(@Body() body: SignupWithEmailDto) {
    const command = new SignupWithEmailCommand({ ...body })
    await this.signupWithEmailCommandHandler.execute(command)
  }
}
