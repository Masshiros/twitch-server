import { ApiProperty } from "@nestjs/swagger"
import { Expose } from "class-transformer"

export class ImageResponseDto {
  @ApiProperty({ description: "Post Image" })
  @Expose()
  url: string
}
