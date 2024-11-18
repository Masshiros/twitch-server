import { ApiProperty } from "@nestjs/swagger"

export class CreateCategoryRequestDto {
  @ApiProperty({
    description: "The name of the category",
    example: "Gaming",
  })
  name: string

  @ApiProperty({
    description: "Image to upload",
    type: "string",
    format: "binary",
  })
  image: Express.Multer.File
}
