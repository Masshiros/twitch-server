import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"

export class GetLiveStreamInfoRequestDto {
  @ApiPropertyOptional({
    description: "The unique identifier of user",
    example: "123e4567-e89b-12d3-a456-426614174002",
  })
  @IsOptional()
  @IsString({ message: "User ID must be a string" })
  userId?: string
}
