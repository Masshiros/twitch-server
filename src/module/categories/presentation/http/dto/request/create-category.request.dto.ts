import { ApiProperty } from "@nestjs/swagger"
import { ECategory } from "src/module/categories/domain/enum/categories.enum"

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

  @ApiProperty({
    description: "The applicable category type",
    enum: ECategory,
    example: ECategory.USER,
  })
  applicableTo: ECategory
}
