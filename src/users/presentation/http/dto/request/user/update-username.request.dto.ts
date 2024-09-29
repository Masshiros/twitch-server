import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class UpdateUsernameRequestDto {
  @ApiPropertyOptional({
    description: "The new username of the user",
    example: "johndoe_123",
  })
  @IsString()
  readonly username?: string
}
