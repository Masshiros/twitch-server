import { IsString } from "class-validator"

export class ConfirmEmailResponseDto {
  @IsString()
  readonly accessToken: string
  @IsString()
  readonly refreshToken: string
}
