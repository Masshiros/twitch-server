import { Body, Controller, Param, Patch, Post, Response } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { Request as ExpressRequest, Response as ExpressResponse } from "express"
import { Permissions } from "libs/constants/permissions"
import { SuccessMessages } from "libs/constants/success"
import { ApiOperationDecorator } from "libs/decorator/api-operation.decorator"
import { CurrentUser } from "libs/decorator/current-user.decorator"
import { DecodedTokenPayload } from "libs/decorator/decoded_token_payload.decorator"
import { Permission } from "libs/decorator/permission.decorator"
import { Public } from "libs/decorator/public.decorator"
import { ResponseMessage } from "libs/decorator/response-message.decorator"
import { TokenPayload } from "src/common/interface"
import { AuthService } from "../application/auth.service"
import { ConfirmEmailCommand } from "../application/command/auth/confirm-email/confirm-email.command"
import { ForgotPasswordCommand } from "../application/command/auth/forgot-password/forgot-password.command"
import { LogoutFromAllDeviceCommand } from "../application/command/auth/logout-from-all-device/logout-from-all-device.command"
import { LogoutFromOneDeviceCommand } from "../application/command/auth/logout-from-one-device/logout-from-one-device.command"
import { RefreshTokenCommand } from "../application/command/auth/refresh-token/refresh-token.command"
import { ResendVerifyEmailCommand } from "../application/command/auth/resend-verify-email/resend-verify-email.command"
import { ResetPasswordCommand } from "../application/command/auth/reset-password/reset-password.command"
import { SignInCommand } from "../application/command/auth/signin/signin.command"
import { SignupWithEmailCommand } from "../application/command/auth/signup-with-email/signup-with-email.command"
import { SignupWithPhoneCommand } from "../application/command/auth/signup-with-phone/signup-with-phone.command"
import { ToggleTwoFaCommand } from "../application/command/auth/toggle-two-fa/toggle-two-fa.command"
import { UserAggregate } from "../domain/aggregate"
import { ConfirmEmailRequestDto } from "./http/dto/request/auth/confirm-email.request.dto"
import { ForgotPasswordRequestDto } from "./http/dto/request/auth/forgot-password.request.dto"
import { LogoutFromOneDeviceRequestDto } from "./http/dto/request/auth/logout-from-one-device.request.dto"
import { RefreshTokenRequestDto } from "./http/dto/request/auth/refresh-token.request.dto"
import { ResetPasswordRequestDto } from "./http/dto/request/auth/reset-password.request.dto"
import { SigninRequestDto } from "./http/dto/request/auth/signin.request.dto"
import { SignupWithEmailRequestDto } from "./http/dto/request/auth/signup-with-email.request.dto"
import { SignupWithPhoneRequestDto } from "./http/dto/request/auth/signup-with-phone.request.dto"
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
  @ResponseMessage(SuccessMessages.auth.SIGNUP_EMAIL)
  @Public()
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
  @ResponseMessage(SuccessMessages.auth.SIGNUP_PHONE)
  @Public()
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
  @ResponseMessage(SuccessMessages.auth.SIGNIN)
  @Public()
  @Post("/sign-in")
  async signIn(
    @Body() body: SigninRequestDto,
  ): Promise<SigninResponseDto | null> {
    const command = new SignInCommand(body)
    const result = await this.authService.signin(command)
    return result
  }

  // POST: Refresh token
  @ApiOperationDecorator({
    summary: "Refresh token",
    description: "Refreshes the JWT token using the refresh token",
    type: RefreshTokenResponseDto,
  })
  @ResponseMessage(SuccessMessages.auth.REFRESH_TOKEN)
  @Public()
  @Post("/refresh-token")
  async refreshToken(
    @Body() body: RefreshTokenRequestDto,
    @Response() response: ExpressResponse<RefreshTokenResponseDto | null>,
  ) {
    const command = new RefreshTokenCommand(body)
    const result = await this.authService.refreshToken(command)
    response.send(result)
  }
  @ApiOperationDecorator({
    summary: "Toggle 2FA",
    description: "Toggles Two-Factor Authentication for the user",
    type: null,
    auth: true,
  })
  @ResponseMessage(SuccessMessages.auth.TOGGLE_2FA)
  //Toggle user's 2 FA
  @Patch("/toggle-2-fa")
  async toggle2FA(@CurrentUser() user: UserAggregate) {
    console.log(user)
    const command = new ToggleTwoFaCommand({ id: user.id })
    await this.authService.toggle2FA(command)
  }

  @ApiOperationDecorator({
    summary: "Confirm email",
    description: "Confirms the user's email address",
    type: ConfirmEmailResponseDto,
  })
  @ResponseMessage(SuccessMessages.auth.CONFIRM_EMAIL)
  @Public()
  // confirm user email
  @Post("/confirm-email")
  async confirmEmail(@Body() body: ConfirmEmailRequestDto) {
    const command = new ConfirmEmailCommand({
      ...body,
    })
    await this.authService.confirmEmail(command)
  }

  @ApiOperationDecorator({
    summary: "Resend confirmation email",
    description: "Resends the confirmation email to the user",
    type: null,
    auth: true,
  })
  @ResponseMessage(SuccessMessages.auth.RESEND_CONFIRM_EMAIL)
  @Public()
  @Post("/resend-confirm-email")
  async resendConfirmEmail(@CurrentUser() user: UserAggregate) {
    const command = new ResendVerifyEmailCommand({
      id: user.id,
    })

    await this.authService.resendVerifyEmail(command)
  }

  @ApiOperationDecorator({
    summary: "Forgot password",
    description: "Initiates the forgot password process",
    type: ForgotPasswordRequestDto,
  })
  @ResponseMessage(SuccessMessages.auth.FORGOT_PASSWORD)
  @Public()
  @Post("/forgot-password")
  async forgotPassword(@Body() body: ForgotPasswordRequestDto) {
    const command = new ForgotPasswordCommand(body)
    await this.authService.forgotPassword(command)
  }

  @ApiOperationDecorator({
    summary: "Reset password",
    description: "Reset password when user forgot",
    type: ResetPasswordRequestDto,
    params: [
      {
        name: "token",
        description: "Token receive in email",
        example: "9sidsa9123j",
      },
    ],
  })
  @ResponseMessage(SuccessMessages.auth.RESET_PASSWORD)
  @Public()
  @Post("/reset-password/:token")
  async resetPassword(
    @Param("token") token: string,
    @Body() body: ResetPasswordRequestDto,
  ) {
    const command = new ResetPasswordCommand(body)
    command.token = token
    await this.authService.resetPassword(command)
  }
  @ApiOperationDecorator({
    summary: "Logout from all device",
    description: "Logout from all device",
    auth: true,
  })
  @ResponseMessage(SuccessMessages.auth.LOGOUT_FROM_ALL_DEVICE)
  @Post("/logout-from-all-device")
  async logoutFromAllDevice(@CurrentUser() user: UserAggregate) {
    const command = new LogoutFromAllDeviceCommand({ userId: user.id })
    await this.authService.logoutFromAllDevice(command)
  }
  @ApiOperationDecorator({
    summary: "Logout from current logged in device",
    description: "Logout from this device which user login",
    auth: true,
  })
  @ResponseMessage(SuccessMessages.auth.LOGOUT)
  @Post("/logout")
  async logout(
    @CurrentUser() user: UserAggregate,
    @DecodedTokenPayload() payload: TokenPayload,
  ) {
    const command = new LogoutFromOneDeviceCommand({
      userId: user.id,
      deviceId: payload.deviceId,
    })
    console.log(payload)
    await this.authService.logoutFromOneDevice(command)
  }
  @ApiOperationDecorator({
    summary: "Logout from specific device",
    description: "Logout from the device that user choose",
    type: LogoutFromOneDeviceRequestDto,
    auth: true,
  })
  @ResponseMessage(SuccessMessages.auth.LOGOUT)
  @Post("/logout/:deviceId")
  async logoutFromOneDevice(
    @CurrentUser() user: UserAggregate,
    @Param("deviceId") deviceId: string,
  ) {
    const command = new LogoutFromOneDeviceCommand({
      userId: user.id,
      deviceId: deviceId,
    })
    await this.authService.logoutFromOneDevice(command)
  }
}
