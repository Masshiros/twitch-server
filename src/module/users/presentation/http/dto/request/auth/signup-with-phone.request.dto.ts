import { ApiProperty } from "@nestjs/swagger"
import { IsISO8601, IsNotEmpty, IsString } from "class-validator"

export class SignupWithPhoneRequestDto {
  @ApiProperty({
    description: "The phone number of the user",
    example: "+1234567890",
  })
  @IsString()
  @IsNotEmpty()
  readonly phone: string

  @ApiProperty({
    description: "The password of the user",
    example: "strong_password",
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string

  @ApiProperty({
    description: "Date of birth in ISO 8601 format",
    example: "2000-01-01",
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
