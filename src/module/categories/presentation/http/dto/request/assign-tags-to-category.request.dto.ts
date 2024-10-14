import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class AssignTagsToCategoryRequestDto {
  @ApiProperty({
    description: "The unique identifier of category",
    example: "e5b1c6d0-a7b6-4f7e-8fa7-923f8bcdb8c7",
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  categoryId: string
  @ApiProperty({
    description: "List of tag IDs to associate with the category",
    example: ["tagId1", "tagId2", "tag3Id"],
    isArray: true,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  tagIds: string[]
}
