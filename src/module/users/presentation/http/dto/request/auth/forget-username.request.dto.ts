import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class ForgetUsernameRequestDto {
  @ApiProperty({
    description: "Email of user",
    example: "abc@gmail.com",
  })
  @IsString()
  @IsNotEmpty()
  email: string
}
