import { ApiProperty } from "@nestjs/swagger"
import { ECategory } from "src/module/categories/domain/enum/categories.enum"

export class CreateCategoryRequestDto {
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

  @ApiProperty({
    description: "The applicable category type",
    enum: ECategory,
    example: ECategory.USER,
  })
  applicableTo: ECategory
}
