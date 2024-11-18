import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class SetStreamInfoRequestDto {
  @ApiProperty({
    description: "The new title for the livestream.",
    example: "My Awesome Livestream",
  })
  @IsString({ message: "Title must be a string." })
  @IsNotEmpty({ message: "Title must not be empty." })
  title: string

  @ApiProperty({
    description: "List of category IDs to associate with the user",
    example: ["categoryId1", "categoryId2", "category3Id"],
    isArray: true,
    type: String,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoryIds: string[]
  @ApiProperty({
    description: "List of tag IDs to associate with the user",
    example: ["tagId1", "tagId2", "tag3Id"],
    isArray: true,
    type: String,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagsIds: string[]
}
