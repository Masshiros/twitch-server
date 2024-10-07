import { IsString } from "class-validator"

export class SigninResponseDto {
  @IsString()
  readonly accessToken: string
  @IsString()
  readonly refreshToken: string
}
