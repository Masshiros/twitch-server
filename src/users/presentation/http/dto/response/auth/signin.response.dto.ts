import { IsString } from "class-validator"

export class SigninResponseDto {
  @IsString()
  readonly token: string
}
