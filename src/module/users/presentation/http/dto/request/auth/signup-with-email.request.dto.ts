import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsISO8601, IsNotEmpty, IsString } from "class-validator"

export class SignupWithEmailRequestDto {
  @ApiProperty({
    description: "The email of the user",
    example: "john@example.com",
  })
  @IsString()
  @IsNotEmpty()
  readonly email: string

  @ApiProperty({
    description: "The password of the user",
    example: "strong_password",
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string

  @ApiProperty({
    description: "Date of birth in ISO 8601 format",
    example: "2024-10-07T07:46:22.692Z",
  })
  @IsISO8601()
  @IsNotEmpty()
  readonly dob: Date

  @ApiProperty({
    description: "Full name of the user",
    example: "John Doe",
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string
}