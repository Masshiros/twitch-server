import { ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsNumber, IsOptional } from "class-validator"
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
    description: "Filters to apply to the user list",
    type: UserFilters,
  })
  @IsOptional()
  filters?: UserFilters
}
