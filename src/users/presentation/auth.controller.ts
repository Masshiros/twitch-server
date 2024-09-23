import { type Mapper } from "@automapper/core"
import { InjectMapper } from "@automapper/nestjs"
import { Body, Controller, Post, Response } from "@nestjs/common"
import { Request as ExpressRequest, Response as ExpressResponse } from "express"
import { AuthService } from "../application/auth.service"
import { SignInCommand } from "../application/command/auth/signin/signin.command"
import { SignupWithEmailCommand } from "../application/command/auth/signup-with-email/signup-with-email.command"
import { SignupWithPhoneCommand } from "../application/command/auth/signup-with-phone/signup-with-phone.command"
import { SigninRequestDto } from "./http/dto/request/auth/signin.request.dto"
import { SignupWithEmailRequestDto } from "./http/dto/request/auth/signup-with-email.request.dto"
import { SignupWithPhoneRequestDto } from "./http/dto/request/auth/signup-with-phone.request.dto"
import { SigninResponseDto } from "./http/dto/response/signin.response.dto"

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}
  @Post("/signup-with-email")
  async signUpWithEmail(@Body() body: SignupWithEmailRequestDto) {
    const command = this.mapper.map(
      body,
      SignupWithEmailRequestDto,
      SignupWithEmailCommand,
    )
    await this.authService.signupWithEmail(command)
  }
  @Post("/signup-with-phone")
  async signUpWithPhone(@Body() body: SignupWithPhoneRequestDto) {
    const command = this.mapper.map(
      body,
      SignupWithPhoneRequestDto,
      SignupWithPhoneCommand,
    )
    await this.authService.signupWithPhone(command)
  }
  @Post("/sign-in")
  async signIn(
    @Body() body: SigninRequestDto,
    @Response() response: ExpressResponse<SigninResponseDto>,
  ) {
    const command = this.mapper.map(body, SigninRequestDto, SignInCommand)
    const result = await this.authService.signin(command)
    response.send(result)
  }
}
