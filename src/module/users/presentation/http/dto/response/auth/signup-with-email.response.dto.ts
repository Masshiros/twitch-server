import { IsString } from "class-validator"

export class SignupWithEmailResponseDto {
  @IsString()
  readonly accessToken: string
  @IsString()
  readonly refreshToken: string
}
