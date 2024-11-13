import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator"
import { EGroupPrivacy } from "src/module/groups/domain/enum/group-privacy.enum"
import { EGroupVisibility } from "src/module/groups/domain/enum/group-visibility.enum"

export class CreateGroupRequestDto {
  @ApiProperty({ description: "Name of the group", type: String })
  @IsString()
  name: string

  @ApiProperty({
    description: "Visibility of the group",
    enum: EGroupVisibility,
    required: true,
  })
  @IsEnum(EGroupVisibility)
  @IsNotEmpty()
  visibility: EGroupVisibility

  @ApiPropertyOptional({
    description: "Privacy of the group",
    enum: EGroupPrivacy,
    default: EGroupPrivacy.VISIBLE,
    required: false,
  })
  @IsOptional()
  @IsEnum(EGroupPrivacy)
  privacy?: EGroupPrivacy

  @ApiPropertyOptional({
    description: "IDs of friends to add to group",
    type: "array",
    items: { type: "string" },
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === "string" ? value.split(",") : value,
  )
  @IsArray()
  friendIds?: string[]
}
