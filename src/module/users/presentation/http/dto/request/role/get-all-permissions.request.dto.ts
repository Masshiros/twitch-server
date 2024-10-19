import { ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsNumber, IsOptional, IsString } from "class-validator"

export class GetAllPermissionsRequestDto {
  @ApiPropertyOptional({
    description: "Which page to display",
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page: number
  @ApiPropertyOptional({
    description: "The number of permissions to return",
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit: number
  @ApiPropertyOptional({
    description: "The field to order",
    example: "name",
  })
  @IsOptional()
  @IsString()
  orderBy: string

  @ApiPropertyOptional({
    description: "Type of order : DESCENDING OR ASCENDING",
    example: "desc",
  })
  @IsOptional()
  @IsString()
  order: "asc" | "desc"
}
