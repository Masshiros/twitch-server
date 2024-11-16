import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, MaxLength } from "class-validator"

export class SetStreamKeyRequestDto {
  @ApiProperty({
    description: "The stream key for the user",
    example: "abc123xyz",
  })
  @IsNotEmpty({ message: "Stream key can not be empty" })
  @IsString({ message: "Stream key must be a string" })
  streamKey: string

  @ApiProperty({
    description: "The server URL for the stream",
    example: "rtmp://live.example.com/stream",
  })
  @IsNotEmpty({ message: "Server URL can not be empty" })
  @IsString({ message: "Server URL must be a string" })
  serverUrl: string
}
