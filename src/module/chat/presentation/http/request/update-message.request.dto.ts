import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class UpdateMessageRequestoDto {
  @ApiProperty({
    description: "The content of message",
    example: "This is a great message",
  })
  @IsNotEmpty({ message: "Message content must not be empty" })
  @IsString({ message: "Message content must be a string" })
  content: string
}
