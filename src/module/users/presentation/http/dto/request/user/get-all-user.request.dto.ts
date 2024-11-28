import { ApiPropertyOptional } from "@nestjs/swagger"
import { Transform, Type } from "class-transformer"
import { IsBoolean, IsNumber, IsOptional } from "class-validator"
import { UserFilters } from "src/common/interface"

export class GetAllUsersRequestDto {
  @ApiPropertyOptional({
    description: "The number of users to return",
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number

  @ApiPropertyOptional({
    description: "Which page to display",
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number
  @ApiPropertyOptional({
    description: "Whether the user is live or not",
    example: true,
    nullable: true,
    type: Boolean,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === "true") return true
    if (value === "false") return false
    return null
  })
  @IsBoolean()
  isLive?: boolean | null
  @ApiPropertyOptional({
    description: "Whether the user is active or not",
    example: true,
    nullable: true,
    type: Boolean,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === "true") return true
    if (value === "false") return false
    return null
  })
  @IsBoolean()
  isActive?: boolean | null
}
