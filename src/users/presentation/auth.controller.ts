import { Body, Controller, Param, Patch, Post, Response } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { Request as ExpressRequest, Response as ExpressResponse } from "express"
import { ApiOperationDecorator } from "libs/decorator/api-operation.decorator"
import { ResponseMessage } from "libs/decorator/response-message.decorator"
import { AuthService } from "../application/auth.service"
import { ConfirmEmailCommand } from "../application/command/auth/confirm-email/confirm-email.command"
import { RefreshTokenCommand } from "../application/command/auth/refresh-token/refresh-token.command"
import { SignInCommand } from "../application/command/auth/signin/signin.command"
import { SignupWithEmailCommand } from "../application/command/auth/signup-with-email/signup-with-email.command"
import { SignupWithPhoneCommand } from "../application/command/auth/signup-with-phone/signup-with-phone.command"
import { ToggleTwoFaCommand } from "../application/command/auth/toggle-two-fa/toggle-two-fa.command"
import { ConfirmEmailRequestDto } from "./http/dto/request/auth/confirm-email.request.dto"
import { RefreshTokenRequestDto } from "./http/dto/request/auth/refresh-token.request.dto"
import { SigninRequestDto } from "./http/dto/request/auth/signin.request.dto"
import { SignupWithEmailRequestDto } from "./http/dto/request/auth/signup-with-email.request.dto"
import { SignupWithPhoneRequestDto } from "./http/dto/request/auth/signup-with-phone.request.dto"
import { ToggleTwoFaRequestDto } from "./http/dto/request/user/toggle-two-fa.request.dto"
import { ConfirmEmailResponseDto } from "./http/dto/response/auth/confirm-email.response.dto"
import { RefreshTokenResponseDto } from "./http/dto/response/auth/refresh-token.response.dto"
import { SigninResponseDto } from "./http/dto/response/auth/signin.response.dto"

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST: Sign up with email
  @ApiOperationDecorator({
    summary: "Sign up with email",
    description: "Creates a new user with email and password",
    type: null,
  })
  @ResponseMessage("Sign up with email successfully")
  @Post("/signup-with-email")
  async signUpWithEmail(@Body() body: SignupWithEmailRequestDto) {
    const command = new SignupWithEmailCommand(body)
    await this.authService.signupWithEmail(command)
  }

  // POST: Sign up with phone
  @ApiOperationDecorator({
    summary: "Sign up with phone",
    description: "Creates a new user with phone and password",
    type: null,
  })
  @Post("/signup-with-phone")
  async signUpWithPhone(@Body() body: SignupWithPhoneRequestDto) {
    const command = new SignupWithPhoneCommand(body)
    await this.authService.signupWithPhone(command)
  }

  // POST: Sign in
  @ApiOperationDecorator({
    summary: "Sign in",
    description: "Authenticates the user and returns a JWT token",
    type: SigninResponseDto,
  })
  @Post("/sign-in")
  async signIn(
    @Body() body: SigninRequestDto,
    @Response() response: ExpressResponse<SigninResponseDto | null>,
  ) {
    const command = new SignInCommand(body)
    const result = await this.authService.signin(command)
    response.send(result)
  }

  // POST: Refresh token
  @ApiOperationDecorator({
    summary: "Refresh token",
    description: "Refreshes the JWT token using the refresh token",
    type: RefreshTokenResponseDto,
  })
  @Post("/refresh-token")
  async refreshToken(
    @Body() body: RefreshTokenRequestDto,
    @Response() response: ExpressResponse<RefreshTokenResponseDto | null>,
  ) {
    const command = new RefreshTokenCommand(body)
    const result = await this.authService.refreshToken(command)
    response.send(result)
  }
  //Toggle user's 2 FA
  @Patch("/toggle-2-fa/:id")
  async toggle2FA(@Param() param: ToggleTwoFaRequestDto) {
    const command = new ToggleTwoFaCommand(param)
    await this.authService.toggle2FA(command)
  }
  // confirm user email
  @Post("/confirm-email")
  async confirmEmail(
    @Body() body: ConfirmEmailRequestDto,
    @Response() response: ExpressResponse<ConfirmEmailResponseDto | null>,
  ) {
    console.log(body)
    const command = new ConfirmEmailCommand({
      // TODO: implement current user - auth guard later
      id: "be37bb0c-ed3c-46c8-9cec-63cff64c7d70",
      ...body,
    })
    const result = await this.authService.confirmEmail(command)
    response.send(result)
  }
}
