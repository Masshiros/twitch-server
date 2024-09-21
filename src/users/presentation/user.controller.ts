import { type Mapper } from "@automapper/core"
import { InjectMapper } from "@automapper/nestjs"
import { Body, Controller, Post } from "@nestjs/common"
import { SignupWithEmailCommand } from "../application/command/user/signup-with-email/signup-with-email.command"
import { SignupWithPhoneCommand } from "../application/command/user/signup-with-phone/signup-with-phone.command"
import { UserService } from "../application/user.service"
import { SignupWithEmailDto } from "./http/dto/request/signup-with-email.dto"
import { SignupWithPhoneDto } from "./http/dto/request/signup-with-phone.dto"

@Controller("users")
export class UserController {
  constructor(
    private readonly userService: UserService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}
  @Post("/signup-with-email")
  async signUpWithEmail(@Body() body: SignupWithEmailDto) {
    const command = this.mapper.map(
      body,
      SignupWithEmailDto,
      SignupWithEmailCommand,
    )
    await this.userService.signupWithEmail(command)
  }
  @Post("/signup-with-phone")
  async signUpWithPhone(@Body() body: SignupWithPhoneDto) {
    const command = this.mapper.map(
      body,
      SignupWithPhoneDto,
      SignupWithPhoneCommand,
    )
    await this.userService.signupWithPhone(command)
  }
}
