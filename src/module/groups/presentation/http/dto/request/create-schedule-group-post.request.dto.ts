import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import {
  IsArray,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator"

export class CreateScheduledGroupPostRequestDto {
  @ApiProperty({ description: "Content of the post", type: String })
  @IsString()
  content: string

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
    description: "IDs of tagged groups",
    type: "array",
    items: { type: "string" },
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === "string" ? value.split(",") : value,
  )
  @IsArray()
  taggedGroupIds?: string[]

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
