import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class ForgotPasswordRequestDto {
  @ApiProperty({
    description: "Email or phone of user",
    example: "0123xxxyyy or abc@gmail.com",
  })
  @IsString()
  @IsNotEmpty()
  readonly emailOrPhone: string
}
