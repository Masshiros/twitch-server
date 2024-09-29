import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class SigninRequestDto {
  @ApiProperty({
    description: "The username of the user",
    example: "john_doe",
  })
  @IsString()
  @IsNotEmpty()
  readonly username: string

  @ApiProperty({
    description: "The password of the user",
    example: "strong_password",
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string
}
