import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class UpdateCommentRequestDTO {
  @ApiProperty({
    description: "The content of the comment",
    example: "This is a great post!",
  })
  @IsNotEmpty({ message: "Comment content must not be empty" })
  @IsString({ message: "Comment content must be a string" })
  content: string

  @ApiPropertyOptional({
    description:
      "The ID of the parent comment if this is a reply to another comment",
    example: "123e4567-e89b-12d3-a456-426614174002",
  })
  @IsOptional()
  @IsString({ message: "Parent ID must be a string" })
  parentId?: string
}
