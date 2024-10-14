import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"

export class GetCategoryBySlugRequestDto {
  @ApiPropertyOptional({
    description: "Slug of category",
    example: "league_of_legends",
  })
  @IsOptional()
  @IsString()
  slug: string
}
