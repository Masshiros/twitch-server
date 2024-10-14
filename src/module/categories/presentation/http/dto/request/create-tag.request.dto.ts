import { ApiProperty } from "@nestjs/swagger"
import { ETag } from "src/module/categories/domain/enum/tags.enum"

export class CreateTagRequestDto {
  @ApiProperty({
    description: "The name of the tag",
    example: "Gaming",
  })
  name: string
  @ApiProperty({
    description: "The applicable tag type",
    enum: ETag,
    example: ETag.CATEGORY,
  })
  applicableTo: ETag
}
