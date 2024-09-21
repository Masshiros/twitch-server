import { type Mapper } from "@automapper/core"
import { InjectMapper } from "@automapper/nestjs"
import { Body, Controller, Post } from "@nestjs/common"
import { AuthService } from "../application/auth.service"
import { SignupWithEmailCommand } from "../application/command/auth/signup-with-email/signup-with-email.command"
import { SignupWithPhoneCommand } from "../application/command/auth/signup-with-phone/signup-with-phone.command"
import { SignupWithEmailDto } from "./http/dto/request/auth/signup-with-email.dto"
import { SignupWithPhoneDto } from "./http/dto/request/auth/signup-with-phone.dto"

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}
  @Post("/signup-with-email")
  async signUpWithEmail(@Body() body: SignupWithEmailDto) {
    const command = this.mapper.map(
      body,
      SignupWithEmailDto,
      SignupWithEmailCommand,
    )
    await this.authService.signupWithEmail(command)
  }
  @Post("/signup-with-phone")
  async signUpWithPhone(@Body() body: SignupWithPhoneDto) {
    const command = this.mapper.map(
      body,
      SignupWithPhoneDto,
      SignupWithPhoneCommand,
    )
    await this.authService.signupWithPhone(command)
  }
}
