import { IsNotEmpty, IsString } from "class-validator"

export class SigninRequestDto {
  @IsString()
  @IsNotEmpty()
  readonly username: string
  @IsString()
  @IsNotEmpty()
  readonly password: string
}
