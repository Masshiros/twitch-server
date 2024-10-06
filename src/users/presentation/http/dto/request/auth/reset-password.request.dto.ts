import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, MinLength } from "class-validator"
import { Match } from "libs/decorator/match.decorator"

export class ResetPasswordRequestDto {
  @ApiProperty({
    description: "The new password for the user",
    example: "newpassword123",
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  readonly password: string

  @ApiProperty({
    description: "The confirm password for the user",
    example: "newpassword123",
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @Match("password")
  readonly confirmPassword: string
}
