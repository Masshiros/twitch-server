import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator"
import { EUserPostVisibility } from "src/module/posts/domain/enum/posts.enum"

export class CreateScheduledUserPostRequestDto {
  @ApiProperty({ description: "Content of the post", type: String })
  @IsString()
  content: string

  @ApiProperty({
    description: "Visibility of the post",
    enum: EUserPostVisibility,
    required: false,
  })
  @IsEnum(EUserPostVisibility)
  @IsOptional()
  visibility?: EUserPostVisibility
  @ApiProperty({
    description: "IDs of users can view post",
    type: "array",
    items: { type: "string" },
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === "string" ? value.split(",") : value,
  )
  @IsArray()
  listUserViewIds?: string[]
  @ApiProperty({
    description: "IDs of tagged users",
    type: "array",
    items: { type: "string" },
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === "string" ? value.split(",") : value,
  )
  @IsArray()
  taggedUserIds?: string[]

  @ApiProperty({
    description: "List of images",
    type: "array",
    items: { type: "string", format: "binary" },
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === "string" ? value.split(",") : value,
  )
  @IsArray()
  images: Express.Multer.File[]
  @ApiProperty({
    description: "Time post will be created in ISO 8601 format",
    example: "2024-10-07T07:46:22.692Z",
  })
  @IsISO8601()
  @IsNotEmpty()
  scheduledAt: Date
}
