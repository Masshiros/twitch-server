import { ApiProperty } from "@nestjs/swagger"

export class AddProfilePictureRequestDto {
  @ApiProperty({
    description: "Image to upload",
    type: "string",
    format: "binary",
  })
  picture: Express.Multer.File
}
