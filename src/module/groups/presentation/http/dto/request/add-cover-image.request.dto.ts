import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class AddCoverImageRequestDto {
  @ApiProperty({
    description: "Image to upload",
    type: "string",
    format: "binary",
  })
  image: Express.Multer.File
}
