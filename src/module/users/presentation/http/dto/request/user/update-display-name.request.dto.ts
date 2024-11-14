import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class UpdateDisplaynameRequestDto {
  @ApiPropertyOptional({
    description: "The new displayName of the user",
    example: "johndoe_123",
  })
  @IsString()
  readonly displayName?: string
}
