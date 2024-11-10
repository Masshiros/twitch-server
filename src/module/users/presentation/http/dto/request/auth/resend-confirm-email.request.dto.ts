import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class ResendConfirmEmailRequestDto {
  @ApiProperty({
    description: "The email of the user",
    example: "john@example.com",
  })
  @IsString()
  @IsNotEmpty()
  readonly email: string
}
