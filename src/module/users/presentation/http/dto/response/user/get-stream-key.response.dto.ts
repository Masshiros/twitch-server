import { ApiProperty } from "@nestjs/swagger"
import { Expose } from "class-transformer"

export class GetStreamKeyResponseDto {
  @ApiProperty({
    description: "The stream key for the user",
    example: "abc123xyz",
  })
  @Expose()
  streamKey: string

  @ApiProperty({
    description: "The server URL for the stream",
    example: "rtmp://live.example.com/stream",
  })
  @Expose()
  serverUrl: string
}
