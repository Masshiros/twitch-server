import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsArray, IsEnum, IsOptional, IsString } from "class-validator"
import { EUserPostVisibility } from "src/module/posts/domain/enum/posts.enum"

export class CreateUserPostRequestDto {
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
