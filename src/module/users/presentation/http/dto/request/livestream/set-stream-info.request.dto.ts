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
    description: "Category ID to associate with the user",
    example: "categoryId1",
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  categoryId: string
}
