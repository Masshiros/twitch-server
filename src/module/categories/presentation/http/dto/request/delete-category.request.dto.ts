import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"

export class DeleteCategoryRequestDto {
  @ApiPropertyOptional({
    description: "The unique identifier of category",
    example: "e5b1c6d0-a7b6-4f7e-8fa7-923f8bcdb8c7",
  })
  @IsOptional()
  @IsString()
  id: string
}
