import { Transform } from "class-transformer"
import { IsNumber, IsOptional } from "class-validator"
import { UserFilters } from "src/common/interface"

export class GetAllUsersRequestDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  limit?: number
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  offset?: number
  @IsOptional()
  filters?: UserFilters
}
