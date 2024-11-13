import { ApiProperty } from "@nestjs/swagger"

export class AddThumbnailRequestDto {
  @ApiProperty({
    description: "Image to upload",
    type: "string",
    format: "binary",
  })
  thumbnail: Express.Multer.File
}
