import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class ConfirmEmailRequestDto {
  @ApiProperty({
    description: "The otp user received",
    example: "123456",
  })
  @IsString()
  @IsNotEmpty()
  readonly otp: string
  @ApiProperty({
    description: "The username of user",
    example: "John",
  })
  @IsString()
  @IsNotEmpty()
  readonly username: string
}
