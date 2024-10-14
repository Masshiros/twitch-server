import { ApiProperty } from "@nestjs/swagger"

export class UpdateCategoryRequestDto {
  @ApiProperty({
    description: "The name of the category",
    example: "Gaming",
  })
  name: string

  @ApiProperty({
    description: "Image URL for the category",
    example: "https://example.com/image.png",
  })
  image: string
}
