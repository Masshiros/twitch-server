import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsArray, IsOptional, IsString } from "class-validator"

export class CreateGroupPostRequestDto {
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
}
