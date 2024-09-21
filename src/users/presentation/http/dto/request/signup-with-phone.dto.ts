import { IsISO8601, IsNotEmpty, IsString } from "class-validator"

export class SignupWithPhoneDto {
  @IsString()
  @IsNotEmpty()
  readonly phone: string
  @IsString()
  @IsNotEmpty()
  readonly password: string
  @IsISO8601()
  @IsNotEmpty()
  readonly dob: Date
  @IsString()
  @IsNotEmpty()
  readonly name: string
}
